import booksData from "../mocks/books.mock.json";
import type { BookItem } from "../types/book";

const books = booksData as BookItem[];

export async function getRadarBooks(): Promise<BookItem[]> {
  await new Promise((resolve) => window.setTimeout(resolve, 260));
  return books;
}
