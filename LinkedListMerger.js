/* This implementation assumes a Linked List
 * with a Node structure as follows:
 * @type Node {
 *   val: number;
 *   next: Node | null;
 * }
 */

/* This solution applies divide & conquer with mergePair function,
 * merging lists pairs until getting a final result.
 * This solution is O(logK), applying recursion.
 */

const mergeLists = (listsArr) => {
  let sentinel;

  for (let index = 1; index < listsArr.length; index += 1) {
    sentinel = mergePair(listsArr[0], listsArr[index]);
  }

  return sentinel;
};

const mergePair = (listA, listB) => {
  // Check if one of the given Lists doesn't exists, and return the other one
  if (!listA || !listB) return listA || listB;

  // Compare the two current values, and link them in ascendent order
  if (listA.val < listB.val) {
      listA.next = mergePair(listA.next, listB);

      return listA;
  } 

  listB.next = mergePair(listA, listB.next);

  return listB; 
};