import type { Request,Response } from "express";
import prisma from "../config/prisma.js";

export const createPost=async(req:Request,res:Response)=>{
    try{
  const {title,content}=req.body;
  if(!title){
    return res.status(400).json({
           message: "Title is required",
    });
  }

  if (!content) {
  return res.status(400).json({
    message: "Content is  required",
  });
}
  

const post=await prisma.post.create({
    data:{
        title,
        content,
        authorId: req.user!.userId,
    },
});


    return res.status(201).json({
         message: "Post created successfully",
         post,
    });
    }
    catch(error){
         console.error(error);

    return res.status(500).json({
      message: "Something went wrong while creating the post",
    });

    }
}

export const getPublishedPosts = async (req: Request, res: Response) => {
  try {
    const keyword =
      typeof req.query.keyword === "string"
        ? req.query.keyword.trim()
        : "";

    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      100
    );

    const skip = (page - 1) * limit;

    const where = {
      published: true,
      ...(keyword
        ? {
            title: {
              contains: keyword,
              mode: "insensitive" as const,
            },
          }
        : {}),
    };

    const [posts, totalPosts] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
              username: true,
            },
          },
        },
      }),

      prisma.post.count({
        where,
      }),
    ]);

    return res.status(200).json({
      message: "Published posts retrieved successfully",
      pagination: {
        currentPage: page,
        limit,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
      },
      posts,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong while retrieving posts",
    });
  }
};


export const getPostById = async (req: Request, res: Response) => {
  try {
   const id = req.params.id;

if (typeof id !== "string") {
  return res.status(400).json({
    message: "Invalid post ID",
  });
}

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
       include: {
    author: {
      select: {
        username: true,
      },
    },
  },
    });

    if (!post || !post.published) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.status(200).json({
      message: "Post retrieved successfully",
      post,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong while retrieving the post",
    });
  }
};

export const updatePost=async(req:Request,res:Response)=>{
    try{
        const id=req.params.id;
        if (typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const{title,content}=req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is  required",
      });
    }
    if (!content) {
      return res.status(400).json({
        message: "Content is  required",
      });
    }

    const post=await prisma.post.findUnique({
        where:{id,},
    });

    if(!post){
        return res.status(404).json({
   message:"Post not found",
        });
    }

 if (post.authorId !== req.user!.userId) {
      return res.status(403).json({
        message: "You can only update your own posts",
      });
    }

     const updatedPost = await prisma.post.update({
      where: {
        id,
      },
      data: {
        title,
        content,
      },
    });

    return res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });  


    }

    catch(error){
         console.error(error);

    return res.status(500).json({
      message: "Something went wrong while updating the post",
    });
    }
}


export const deletePost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.authorId !== req.user!.userId) {
      return res.status(403).json({
        message: "You can only delete your own posts",
      });
    }

    await prisma.post.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong while deleting the post",
    });
  }
};


export const updatePostPublishStatus = async (req: Request,res: Response) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const { published } = req.body;

    if (typeof published !== "boolean") {
      return res.status(400).json({
        message: "Published must be true or false",
      });
    }

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.authorId !== req.user!.userId) {
      return res.status(403).json({
        message: "You can only change the status of your own posts",
      });
    }

    const updatedPost = await prisma.post.update({
      where: {
        id,
      },
      data: {
        published,
      },
    });

    return res.status(200).json({
      message: published
        ? "Post published successfully"
        : "Post unpublished successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong while updating post status",
    });
  }
};


export const getMyPosts = async (req: Request, res: Response) => {
  try {
    const keyword =
      typeof req.query.keyword === "string"
        ? req.query.keyword.trim()
        : "";

    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      100
    );

    const skip = (page - 1) * limit;

    const where = {
      authorId: req.user!.userId,
      ...(keyword
        ? {
            title: {
              contains: keyword,
              mode: "insensitive" as const,
            },
          }
        : {}),
    };

    const [posts, totalPosts] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
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
      message: "Your posts retrieved successfully",
      pagination: {
        currentPage: page,
        limit,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
      },
      posts,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong while retrieving your posts",
    });
  }
};