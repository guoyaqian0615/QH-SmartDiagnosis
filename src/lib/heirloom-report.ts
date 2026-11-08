import { toPng } from "html-to-image";

export async function downloadElementAsPng(
  node: HTMLElement,
  filename: string,
  options?: { backgroundColor?: string },
): Promise<void> {
  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: options?.backgroundColor ?? "#f4faf3",
  });
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
