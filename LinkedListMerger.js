/* This implementation assumes a Linked List
 * with a Node structure as follows:
 * @type Node {
 *   val: number;
 *   next: Node | null;
 * }
 */

/* This solution applies divide & conquer with mergePair function,
 * merging lists pairs until getting a final result.
 * This solution is O(logK(N)), applying recursion.
 */

const mergeLists = (listsArr) => {
  let sentinel;

  for (let index = 1; index < listsArr.length; index += 1) {
    sentinel = mergePair(listsArr[0], listsArr[index]);
  }

  return sentinel;
};

const mergePair = (nodeA, nodeB) => {
  // Check if one of the given Nodes doesn't exists, and return the other one
  if (!nodeA || !nodeB) return nodeA || nodeB;

  // Compare the two current values, and link them in ascendent order
  if (nodeA.val < nodeB.val) {
      nodeA.next = mergePair(nodeA.next, nodeB);

      return nodeA;
  } 

  nodeB.next = mergePair(nodeA, nodeB.next);

  return nodeB; 
};