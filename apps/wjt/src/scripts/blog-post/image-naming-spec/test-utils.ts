import { Node, Parser } from 'commonmark';

export const parseMarkdownString = (markdown: string): Node => {
  const parser = new Parser();
  return parser.parse(markdown);
};

export const getImageNodes = (node: Node): Node[] => {
  const imageNodes: Node[] = [];

  const walker = node.walker();
  let event;
  while ((event = walker.next())) {
    const { node } = event;
    if (node.type === 'image' && !imageNodes.includes(node)) {
      imageNodes.push(node);
    }
  }

  return imageNodes;
};

export const getNodesArr = (node: Node): Node[] => {
  const nodes: Node[] = [];

  const walker = node.walker();
  let event;
  while ((event = walker.next())) {
    const { node } = event;
    nodes.push(node);
  }

  return nodes;
};
