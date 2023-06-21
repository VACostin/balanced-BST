class TreeNode {
  constructor(data = null) {
    this.data = data;
    this.left = null;
    this.right = null;
    this.height = 0;
    this.depth = 0;
  }
}

class BinarySearchTree {
  constructor(array = undefined) {
    this._head = null;
    if (array !== undefined && array.length > 0) {
      array = [...new Set(array)];
      array = this.#mergeSort(array);
      this.#buildTree(array);
    }
  }

  set head(head) {
    this._head = head;
  }

  get head() {
    return this._head;
  }

  #mergeSort(array) {
    const n = array.length;
    if (n === 1) return array;
    const left = this.#mergeSort(array.slice(0, n / 2));
    const right = this.#mergeSort(array.slice(n / 2, n));
    const newArr = [];
    while (left.length > 0 && right.length > 0) {
      if (left[0] < right[0]) newArr.push(left.shift());
      else newArr.push(right.shift());
    }
    if (left.length > 0) return [...newArr, ...left];
    return [...newArr, ...right];
  }

  #buildTree(array) {
    const n = array.length;
    if (n === 1) this.insert(array[0]);
    else {
      const middle = Math.floor(n / 2);
      this.insert(array[middle]);
      this.#buildTree(array.slice(0, middle));
      this.#buildTree(array.slice(middle, n));
    }
  }

  insert(data) {
    if (this._head === null) {
      this._head = new TreeNode(data);
      return this._head;
    }
    return this.#insert(data);
  }

  #insert(data, node = this._head, depth = 1) {
    let newNode;
    if (data < node.data) {
      if (node.left === null) {
        newNode = new TreeNode(data);
        newNode.depth = depth;
        node.left = newNode;
      } else newNode = this.#insert(data, node.left, depth + 1);
    } else if (data > node.data) {
      if (node.right === null) {
        newNode = new TreeNode(data);
        newNode.depth = depth;
        node.right = newNode;
      } else newNode = this.#insert(data, node.right, depth + 1);
    }

    node.height = this.#getMaxHeight(node);

    return newNode;
  }

  delete(data, node = this._head) {
    this.#delete(data, node);
  }

  #delete(data, node, nodeParent = null) {
    if (node === null) console.log("couldn't find it mate");
    else {
      if (data < node.data) this.#delete(data, node.left, node);
      else if (data > node.data) this.#delete(data, node.right, node);
      else this.#replace(node, nodeParent);
      node.height = this.#getMaxHeight(node);
    }
  }

  find(data, node = this._head) {
    if (node === null) return null;
    if (data < node.data) return this.find(data, node.left);
    if (data > node.data) return this.find(data, node.right);
    return node;
  }

  levelOrder(callback = (data) => data, node = this._head) {
    let array = [];
    for (let depth = 0; depth <= node.height; depth++)
      array = [...array, ...this.#bft(callback, node, depth)];
    return array;
  }

  #bft(callback, node, depth) {
    if (node === null) return [];
    if (node.depth === depth) return [callback(node.data)];
    return [
      ...this.#bft(callback, node.left, depth),
      ...this.#bft(callback, node.right, depth),
    ];
  }

  inorder(callback = (data) => data) {
    return this.#inorder(callback);
  }

  #inorder(callback, node = this._head) {
    if (node === null) return [];
    return [
      ...this.#inorder(callback, node.left),
      callback(node.data),
      ...this.#inorder(callback, node.right),
    ];
  }

  preorder(callback = (data) => data) {
    return this.#preorder(callback);
  }

  #preorder(callback, node = this._head) {
    if (node === null) return [];
    return [
      callback(node.data),
      ...this.#preorder(callback, node.left),
      ...this.#preorder(callback, node.right),
    ];
  }

  postorder(callback = (data) => data) {
    return this.#postorder(callback);
  }

  #postorder(callback, node = this._head) {
    if (node === null) return [];
    return [
      ...this.#postorder(callback, node.left),
      ...this.#postorder(callback, node.right),
      callback(node.data),
    ];
  }

  height(node = this._head) {
    return node === null ? -1 : node.height;
  }

  depth(node = this._head) {
    return node === null ? -1 : node.depth;
  }

  #getMaxHeight(node) {
    const left = this.height(node.left) + 1;
    const right = this.height(node.right) + 1;
    return left > right ? left : right;
  }

  #replace(node, nodeParent) {
    if (node.left !== null) {
      node.data = node.left.data;
      this.#replace(node.left, node);
      node.height = this.#getMaxHeight(node);
    } else if (node.right !== null) {
      node.data = node.right.data;
      this.#replace(node.right, node);
      node.height = this.#getMaxHeight(node);
    } else {
      if (nodeParent === null) this._head = null;
      else
        nodeParent.left === node
          ? (nodeParent.left = null)
          : (nodeParent.right = null);
    }
  }

  isBalanced() {
    if (this._head !== null)
      return !this.#isNotBalanced(this._head, this._head.height);
    return console.log("nothing to balance");
  }

  #isNotBalanced(node, height) {
    if (node === null) return false;
    if (node.left === null && node.right === null)
      return height - node.depth > 1;
    if (node.left === null)
      return height - node.depth > 1 || this.#isNotBalanced(node.right, height);
    if (node.right === null)
      return height - node.depth > 1 || this.#isNotBalanced(node.left, height);
    return (
      this.#isNotBalanced(node.left, height) ||
      this.#isNotBalanced(node.right, height)
    );
  }

  rebalance() {
    if (!this.isBalanced()) {
      let array = this.inorder();
      this._head = null;
      array = [...new Set(array)];
      array = this.#mergeSort(array);
      this.#buildTree(array);
    }
  }
}
const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

const ARRAY_LENGTH = 20;
const NUMBERS_TO_INSERT = 8;
const array = [];
const numbers = [];
for (let i = 0; i < ARRAY_LENGTH; i += 1)
  array.push(Math.floor(Math.random() * 100));

// 1
console.log("Creating tree...");
const tree = new BinarySearchTree(array);
console.log("Done!");
prettyPrint(tree.head);
// 2
console.log(`Is balanced?: ${tree.isBalanced()}`);
// 3
console.log(`Inorder: ${tree.inorder()}`);
console.log(`Preorder: ${tree.preorder()}`);
console.log(`Postorder: ${tree.postorder()}`);
// 4
console.log(`Inserting ${NUMBERS_TO_INSERT} numbers into tree...`);
for (let i = 0; i < NUMBERS_TO_INSERT; i += 1)
  tree.insert(Math.floor(Math.random() * 1000) + 100);
console.log("Done!");
prettyPrint(tree.head);
// 5
console.log(`Is balanced?: ${tree.isBalanced()}`);
// 6
if (!tree.isBalanced()) {
  console.log(`Rebalancing...`);
  tree.rebalance();
  console.log("Done!");
  prettyPrint(tree.head);
  // 7
  console.log(`Is balanced?: ${tree.isBalanced()}`);
}
// 8
console.log(`Inorder: ${tree.inorder()}`);
console.log(`Preorder: ${tree.preorder()}`);
console.log(`Postorder: ${tree.postorder()}`);
