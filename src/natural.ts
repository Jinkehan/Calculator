import { List, cons, nil, rev, revAcc } from './list';
import {  } from './webpack.config';


// Note: the <b>bigint</b> class should not be used in this file!
// This implements an alternative to bigint.


// Represents a natural (non-negative) number in a base .. 36.
//
// Inv: base and digits contain only integers and 2<= base and
//      0 <= digits[i] < base for any 0 <= i < digits.length and
//      digits[digits.length-1] /= 0
export type Natural = {digits: List<number>, base: number};


/**
 * Converts a character 0-9 | a-z | A-Z into an integer 0 .. 35.
 * @param ch A letter in the range 0-9, a-z, or A-Z
 * @returns An integer in the range 0 .. b-1 represented by the character,
 *   where 0-9 map to 0..9 and a-z | A-Z map to 10 .. 35.
 */
const toDigit = (ch: string): number => {
  if (ch.length !== 1)
    throw new Error(`not a character: "${ch}"`);

  const c = ch.charCodeAt(0);
  if ('0' <= ch && ch <= '9') {
    return c - '0'.charCodeAt(0);
  } else if ('a' <= ch && ch <= 'z') {
    return (c - 'a'.charCodeAt(0)) + 10;
  } else if ('A' <= ch && ch <= 'Z') {
    return (c - 'A'.charCodeAt(0)) + 10;
  } else {
    throw new Error(`not a valid digit: "${ch}"`);
  }
};

/**
 * Converts an integer in 0 .. 35 to a character in 0-9 | A-Z.
 * @param d the digit in question
 * @returns the corresponding digit in 0-9 if d is in 0 .. 9 and
 *   the (d-10)-th digit after 'A' if d is in 10 .. 35
 */
const fromDigit = (d: number): string => {
  if (d !== Math.floor(d))
    throw new Error(`not an integer: ${d}`);

  if (d < 0) {
    throw new Error(`too small to be a valid digit: ${d}`);
  } else if (d <= 9) {
    return String.fromCharCode("0".charCodeAt(0) + d);
  } else if (d <= 35) {
    return String.fromCharCode("A".charCodeAt(0) + (d - 10));
  } else {
    throw new Error(`too large to be a valid digit: ${d}`);
  }
};


/**
 * Converts a natural number into a list of characters. Note that we write
 * digits big-endian but store them little-endian, so we must reverse the list
 * after mapping from digits to characters.
 * @param nat The natural number to convert
 * @return "0" if nat.digits = nil else rev(digits-to-str(nat.digits)), where
 *   digits-to-str(nil) = nil
 *   digits-to-str(d :: ds) = from-digit(d) :: digits-to-str(ds)
 */
export const naturalToString = (nat: Natural): List<string> => {
  if (nat.digits.kind === "nil")
    return cons("0", nil);

  let chars: List<string> = nil; 
  let digits: List<number> = nat.digits;

  // Task 1-1
  // Inv: rev(digits-to-str(digits_0)) = rev(digits-to-str(digits)) ++ chars
  while (digits.kind !== "nil") {
    chars = cons(fromDigit(digits.hd), chars);
    digits = digits.tl;
  }

  return chars; // = rev(digits-to-str(digits_0))
};


/**
 * Converts a a list of characters into a natural number. Note that we store
 * digits little-endian, while they are written big-endian, so we must reverse
 * the list of characters before mapping chars to digits.
 * @param chars A list of characters, with the left-most at the front.
 * @param base A valid base (i.e., an integer in the range 2 .. 36).
 * @returns {digits: nil, base: base} if chars = "0" :: nil. Otherwise,
 * this returns {digits: str-to-digits(rev(chars), base), base: base}, where
 *   str-to-digits(nil, b) = nil
 *   str-to-digits(c :: cs, b) = d :: str-to-digits(cs, b)  if d < b
 *   str-to-digits(c :: cs, b) = undefined                  if d >= b
 *     where d = to-digit(c)
 */
export const stringToNatural = (chars: List<string>, base: number): Natural => {
  if (base < 2 || 36 < base || base !== Math.floor(base))
    throw new Error(`not a valid base: ${base}`);

  if (chars.kind !== "nil" && chars.tl.kind === "nil" && chars.hd == "0")
    return {digits: nil, base};

  return {digits: strToDigits(rev(chars), base), base: base};
};

/** Helper function for stringToNatural */
const strToDigits = (cs: List<string>, b: number): List<number> => {
  if (cs.kind === "nil") {
    return nil;
  } else {
    const d = toDigit(cs.hd);
    if (d >= b)
      throw new Error(`not a valid base-${b} digit: ${d}`);
    return cons(d, strToDigits(cs.tl, b));
  }
};

/**
 * Converts the given number into a natural, stored in the given base.
 * @param n The non-negative integer to convert to a Natural.
 * @param base A valid base (i.e., an integer in the range 2 .. 36).
 * @return {digits, base} such that value(digits, base) = n
 */
export const numberToNatural = (n: number, base: number): Natural => {
  if (n < 0 || n !== Math.floor(n))
    throw new Error(`not a non-negative integer: ${n}`);
  if (base < 2 || 36 < base || base !== Math.floor(base))
    throw new Error(`not a valid base: ${base}`);

  let digits: List<number> = nil;

  // Inv: rev(num-to-digits(n_0)) = rev(num-to-digits(n)) ++ digits
  while (n !== 0) {
    digits = cons(n % base, digits);
    n = Math.floor(n / base);
  }

  return {digits: rev(digits), base};
};


/**
 * Returns the natural number representing value(nat) * value(mat)
 * @param nat The first natural number.
 * @param mat The second natural number.
 * @returns {digits, base} such that value(digits, base) = value(nat) + value(mat)
 */
export const add = (nat: Natural, mat: Natural): Natural => {
  if (nat.base !== mat.base)
    throw Error(`cannot multiply different bases: ${nat.base} vs ${mat.base}`);

  let as = nat.digits;
  let bs = mat.digits;
  let ds: List<number> = nil;
  let c = 0;

  // Inv: rev(add(as_0, bs_0, 0)) = rev(add(as, bs, c)) ++ ds
  while ((as.kind !== "nil" && bs.kind !== "nil" ) || (c !== 0 && (as.kind !== "nil" || bs.kind !== "nil"))) {
    let a = 0;
    let b = 0;
    if (as.kind !== "nil") {
      a = as.hd;
      as = as.tl;
    }
    if (bs.kind !== "nil") {
      b = bs.hd;
      bs = bs.tl;
    }
    let sum = a + b + c;
    if (sum < nat.base) {
      ds = cons(sum, ds);
      c = 0;
    } else {
      ds = cons(sum-nat.base, ds);
      c = 1;
    }
  }

  // Calculate rs = add(as, bs, c)
  let rs: List<number> = nil;
  if (as.kind !== "nil") {
    rs = as;
  }
  if (bs.kind !== "nil") {
    rs = bs;
  }
  if (c === 1) {
    rs = cons(1,nil);
  }

  // We now know that rev(add(as, bs, 0)) = rev(rs) ++ ds,
  // so we want to return rev(rev(rs) ++ ds) = rev(ds) ++ rs.
  // Conveniently, the revAcc function does that for us.
  return {digits: revAcc(ds, rs), base: nat.base};
};


/**
 * Returns a natural number representing s * value(nat).
 * @param nat The natural number to convert
 * @param s The non-negative integer to scale by
 * @returns {digits, base} such that value(digits, base) = s * value(nat)
 */
export const scale = (nat: Natural, s: number): Natural => {
  if (s < 0 || s !== Math.floor(s))
    throw new Error(`not a non-negative integer: ${s}`);

  if (nat.digits.kind === "nil") {
    return nat; 
  } else {
    const first = numberToNatural(s * nat.digits.hd, nat.base);
    const rest = scale({digits: nat.digits.tl, base: nat.base}, s);
    return add(first, {digits: cons(0, rest.digits), base: nat.base});
  }
};

/**
 * Returns the natural number representing value(nat) * value(mat)
 * @param nat The first natural number.
 * @param mat The second natural number.
 * @returns {digits, base} such that value(digits, base) = value(nat) * value(mat)
 */
export const mul = (nat: Natural, mat: Natural): Natural => {
  if (nat.base !== mat.base)
    throw Error(`cannot multiply different bases: ${nat.base} vs ${mat.base}`);

  if (mat.digits.kind === "nil") {
    return mat;
  } else {
    const first = scale(nat, mat.digits.hd);
    const rest = mul(nat, {digits: mat.digits.tl, base: mat.base});
    return add(first, {digits: cons(0, rest.digits), base: rest.base});
  }
};


/**
 * Returns the representation of the given natural number in the given base.
 * @param nat The nonnegative integer to convert.
 * @param base The new base for the integer.
 * @returns {digits, base} such that value(digits, base) = value(nat)
 */
export const changeBase = (nat: Natural, base: number): Natural => {
  if (base < 2 || 36 < base || base !== Math.floor(base))
    throw new Error(`not a valid base: ${base}`);

  if (nat.digits.kind === "nil") {
    return {digits: nil, base};
  } else {
    const first = numberToNatural(nat.digits.hd, base);
    const rest = changeBase({digits: nat.digits.tl, base: nat.base}, base);
    return add(first, scale(rest, nat.base));
  }
};
