export interface Tree<T> {
  children?: Tree<T>[];
}

export async function accessTree<T>(tree: Tree<T>[], fn: (t: Tree<T>) => Promise<boolean>) {
  for (const t of tree) {
    const ok = await fn(t);
    if (!ok) {
      return;
    }
    if (t.children) {
      await accessTree(t.children, fn);
    }
  }
}
