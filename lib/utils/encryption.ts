import { createCipheriv, createDecipheriv, randomBytes } from "crypto"
import { env } from "@/lib/env"

// Use a secure encryption algorithm
const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16

export function encrypt(text: string): string {
  try {
    // Generate a random initialization vector
    const iv = randomBytes(IV_LENGTH)

    // Create a key buffer from the environment variable
    const key = Buffer.from(env.ENCRYPTION_KEY, "hex")

    // Create cipher
    const cipher = createCipheriv(ALGORITHM, key, iv)

    // Encrypt the text
    let encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")

    // Get the authentication tag
    const authTag = cipher.getAuthTag()

    // Return the IV, encrypted text, and authentication tag as a single string
    return `${iv.toString("hex")}:${encrypted}:${authTag.toString("hex")}`
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Failed to encrypt data")
  }
}

export function decrypt(encryptedText: string): string {
  try {
    // Split the encrypted text into IV, encrypted data, and authentication tag
    const [ivHex, encrypted, authTagHex] = encryptedText.split(":")

    // Convert hex strings back to buffers
    const iv = Buffer.from(ivHex, "hex")
    const authTag = Buffer.from(authTagHex, "hex")
    const key = Buffer.from(env.ENCRYPTION_KEY, "hex")

    // Create decipher
    const decipher = createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    // Decrypt the text
    let decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  } catch (error) {
    console.error("Decryption error:", error)
    throw new Error("Failed to decrypt data")
  }
}
