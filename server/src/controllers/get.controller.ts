import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPhotos = async (req: Request, res: Response): Promise<any> => {
  try {
    // 1. Fetch photo AND its characters in a single query
    const photos = await prisma.photo.findMany({
      include: {
        characters: true,
      },
    });

    // 2. Sanitize: Create a clean object structure WITHOUT coordinates
    const sanitizedPhotos = photos.map((photo) => ({
      id: photo.id,
      name: photo.name,
      url: photo.URL,
      characters: photo.characters.map((char) => ({
        id: char.id,
        name: char.name,
      })),
    }));

    // 3. Respond with the SAFE data
    res.status(200).json(sanitizedPhotos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
