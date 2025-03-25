export type List<A> =
    | {readonly kind: "nil"}
    | {readonly kind: "cons", readonly hd: A, readonly tl: List<A>};


/** The empty list. */
export const nil: {kind: "nil"} = {kind: "nil"};

/** Returns a list with hd in front of tl. */
export const cons = <A,>(hd: A, tl: List<A>): List<A> => {
  return {kind: "cons", hd: hd, tl: tl};
};


/**
 * Returns the length of the list.
 * @param L list whose length should be returned
 * @returns 0 if L = nil else 1 + len(tail(L))
 */
export const len = <A,>(L: List<A>): bigint => {
  if (L.kind === "nil") {
    return 0n;
  } else {
    return 1n + len(L.tl);
  }
};

/**
 * Determines whether the two given lists are equal, using === to compare the
 * corresponding values in the lists.
 * @param L The first list to compare
 * @param R The second list to compare
 * @returns true iff the lists have the same length and the elements at the same
 *     indexes of the two lists have values that are ===.
 */
export const equal = <A>(L: List<A>, R: List<A>): boolean => {
  if (L.kind === "nil") {
    return R.kind === "nil";
  } else if (R.kind === "nil") {
    return false;
  } else if (L.hd !== R.hd) {
    return false;
  } else {
    return equal(L.tl, R.tl);
  }
};

/**
 * Returns the a list consisting of L followed by R.
 * @param L list to go at the front of the result
 * @param R list to go at the end of the result
 * @returns A single list consisting of L's elements followed by R's
 */
export const concat = <A,>(L: List<A>, R: List<A>): List<A> => {
  if (L.kind === "nil") {
    return R;
  } else {
    return cons(L.hd, concat(L.tl, R));
  }
};

/**
 * Returns the reverse of the given list.
 * @param L list to reverse
 * @returns list containing the same elements but in reverse order
 */
export const rev = <A>(L: List<A>): List<A> => {
  return revAcc(L, nil);
};

/**
 * Returns the concatenation of the reversal of L and R
 * @returns rev(L) ++ R
 */
export const revAcc = <A>(L: List<A>, R: List<A>): List<A> => {
  // Inv: rev(L_0) ++ R_0 = rev(L) ++ R
  while (L.kind !== "nil") {
    R = cons(L.hd, R);
    L = L.tl;
  }
  return R;
};


/**
 * Returns the elements of a list, packed into an string.
 * @param L the list to turn into a string
 * @returns string consisting of the same elements as in L in the same order
 */
export const compact = (L: List<string>): string => {
  const S: Array<string> = [];

  // Inv: compact(L_0) = compact(T ++ L) and join(S) = compact(T)
  while (L.kind !== "nil") {
    S.push(L.hd);
    L = L.tl;
  }

  return S.join("");
};

/**
 * Returns the elements in the given string as a list.
 * @param str the string to turn into a list
 * @returns list containing the same elements as in str in the same order
 */
export const explode = (str: string): List<string> => {
  let S: List<string> = nil;
  let i = str.length - 1;

  // Inv: explode(str_0) = explode(str[0..i]) ++ S
  while (i >= 0) {
    S = cons(str[i], S);
    i -= 1;
  }

  return S;
};


/**
 * Returns the elements of a list, packed into an array.
 * @param L the list to turn into an array
 * @returns array containing the same elements as in L in the same order
 */
export const compactList = <A>(L: List<A>): Array<A> => {
  const S: Array<A> = [];

  // Inv: compactList(L_0) = compactList(T ++ L) and S = compactList(T)
  while (L.kind !== "nil") {
    S.push(L.hd);
    L = L.tl;
  }

  return S;
};


/** Returns the part of the list after any leading "val"s
 * @param val The value to remove from teh front of the list
 * @param L The list in question
 * @return remove-leading(val, L), where
 *   remove-leading(v, nil) := nil
 *   remove-leading(v, w :: ws) := w :: ws  if v /= w
 *   remove-leading(v, w :: ws) := ws       if v = w
 */
export const removeLeading = <A>(val: A, L: List<A>): List<A> => {
  // Inv: remove-leading(val, L_0) = remove-leading(val, L)   [tail recursion]
  while (L.kind !== "nil" && L.hd === val) {
    L = L.tl;
  }

  return L;
}