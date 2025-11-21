import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const validateCoordinates = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { photoId, characterId, x, y } = req.body;

    // Basic validation: If data is missing, reject immediately
    if (!photoId || !characterId || x === undefined || y === undefined) {
      return res
        .status(400)
        .json({
          error: "Missing required fields (photoId, characterId, x, y)",
        });
    }

    // 1. Fetch the character's actual coordinates
    const character = await prisma.character.findFirst({
      where: {
        id: Number(characterId), // Ensure it's a number
        photoId: Number(photoId),
      },
    });

    if (!character) {
      return res.status(404).json({ error: "Character not found." });
    }

    // 2. Validate (Assumes x and y are percentages sent from frontend!)
    // We use a 2% "Hit Box" buffer.
    const isXValid = Math.abs(character.x_percent - x) < 2;
    const isYValid = Math.abs(character.y_percent - y) < 2;

    // 3. Respond
    return res.status(200).json({ found: isXValid && isYValid });
  } catch (error) {
    console.error("Validation Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
