import type { Request, Response } from "express";
import prisma from "../config/prisma.js";

type Role = "ADMIN" | "AUTHOR" | "READER";

const validRoles: Role[] = ["ADMIN", "AUTHOR", "READER"];

const getPagination = (req: Request) => {
  const pageValue = Number(req.query.page);
  const limitValue = Number(req.query.limit);

  const page =
    Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1;

  const limit =
    Number.isInteger(limitValue) && limitValue > 0
      ? Math.min(limitValue, 100)
      : 10;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

const getKeyword = (req: Request) => {
  return typeof req.query.keyword === "string"
    ? req.query.keyword.trim()
    : "";
};

// GET ALL USERS
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const keyword = getKeyword(req);

    const where = keyword
      ? {
          OR: [
            { username: { contains: keyword, mode: "insensitive" as const } },
            { email: { contains: keyword, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return res.status(200).json({
      message: "Users retrieved successfully",
      pagination: {
        currentPage: page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve users",
    });
  }
};

// CHANGE USER ROLE
export const changeUserRole = async (req: Request, res: Response) => {
  try {
   const id = req.params.id;

if (typeof id !== "string") {
  return res.status(400).json({
    message: "Invalid comment ID",
  });
}
    const { role } = req.body;

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Use ADMIN, AUTHOR, or READER",
      });
    }

    if (!id) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.id === req.user?.userId && role !== "ADMIN") {
      return res.status(400).json({
        message: "You cannot remove your own admin role",
      });
    }

    if (user.role === "ADMIN" && role !== "ADMIN") {
      const adminCount = await prisma.user.count({
        where: { role: "ADMIN" },
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          message: "You cannot remove the last admin",
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });

    return res.status(200).json({
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to update user role",
    });
  }
};

// DELETE USER
export const deleteUser = async (req: Request, res: Response) => {
  try {
   const id = req.params.id;

if (typeof id !== "string") {
  return res.status(400).json({
    message: "Invalid comment ID",
  });
}

    if (!id) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    if (id === req.user?.userId) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "ADMIN") {
      const adminCount = await prisma.user.count({
        where: { role: "ADMIN" },
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          message: "You cannot delete the last admin",
        });
      }
    }

    await prisma.user.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to delete user",
    });
  }
};

// GET ALL POSTS
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const keyword = getKeyword(req);

    const where = keyword
      ? {
          OR: [
            { title: { contains: keyword, mode: "insensitive" as const } },
            { content: { contains: keyword, mode: "insensitive" as const } },
            {
              author: {
                username: {
                  contains: keyword,
                  mode: "insensitive" as const,
                },
              },
            },
          ],
        }
      : {};

    const [posts, totalPosts] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              username: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return res.status(200).json({
      message: "Posts retrieved successfully",
      pagination: {
        currentPage: page,
        limit,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
      },
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve posts",
    });
  }
};

// EDIT ANY POST
export const updateAnyPost = async (req: Request, res: Response) => {
  try {
  const id = req.params.id;

if (typeof id !== "string") {
  return res.status(400).json({
    message: "Invalid comment ID",
  });
}
    const { title, content } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Post ID is required",
      });
    }

    if (title === undefined && content === undefined) {
      return res.status(400).json({
        message: "Provide a title or content to update",
      });
    }

    if (
      (title !== undefined &&
        (typeof title !== "string" || !title.trim())) ||
      (content !== undefined &&
        (typeof content !== "string" || !content.trim()))
    ) {
      return res.status(400).json({
        message: "Title and content must be non-empty strings",
      });
    }

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(content !== undefined && { content: content.trim() }),
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to update post",
    });
  }
};

// PUBLISH OR UNPUBLISH ANY POST
export const toggleAnyPostPublish = async (
  req: Request,
  res: Response
) => {
  try {
   const id = req.params.id;

if (typeof id !== "string") {
  return res.status(400).json({
    message: "Invalid comment ID",
  });
}
    const { published } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Post ID is required",
      });
    }

    if (typeof published !== "boolean") {
      return res.status(400).json({
        message: "Published must be true or false",
      });
    }

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { published },
    });

    return res.status(200).json({
      message: published
        ? "Post published successfully"
        : "Post unpublished successfully",
      post: updatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to change post publication status",
    });
  }
};

// DELETE ANY POST
export const deleteAnyPost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

if (typeof id !== "string") {
  return res.status(400).json({
    message: "Invalid comment ID",
  });
}

    if (!id) {
      return res.status(400).json({
        message: "Post ID is required",
      });
    }

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    await prisma.post.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to delete post",
    });
  }
};

// GET ALL COMMENTS
export const getAllComments = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const keyword = getKeyword(req);

    const where = keyword
      ? {
          OR: [
            { content: { contains: keyword, mode: "insensitive" as const } },
            {
              author: {
                username: {
                  contains: keyword,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              post: {
                title: {
                  contains: keyword,
                  mode: "insensitive" as const,
                },
              },
            },
          ],
        }
      : {};

    const [comments, totalComments] = await Promise.all([
      prisma.comment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              username: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
      prisma.comment.count({ where }),
    ]);

    return res.status(200).json({
      message: "Comments retrieved successfully",
      pagination: {
        currentPage: page,
        limit,
        totalComments,
        totalPages: Math.ceil(totalComments / limit),
      },
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve comments",
    });
  }
};

// DELETE ANY COMMENT
export const deleteAnyComment = async (
  req: Request,
  res: Response
) => {
  try {
const id = req.params.id;

if (typeof id !== "string") {
  return res.status(400).json({
    message: "Invalid comment ID",
  });
}

    if (!id) {
      return res.status(400).json({
        message: "Comment ID is required",
      });
    }

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    await prisma.comment.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to delete comment",
    });
  }
};