import * as assert from 'assert';
import { nil, cons, explode } from './list';
import {
    naturalToString, numberToNatural, stringToNatural,
    add, mul, scale, changeBase
} from './natural';

// Note: the tests provided here exceed the minimum number required by our
// course guidelines

describe('natural', function() {

  // NOTE: check out the provided functions compact() and explode() in list.ts
  //    - compact() takes a list of characters (length 0 strings) and turns
  //      them into a string
  //    - explode() takes a string and turns them into a list of individual 
  //      characters
  // These functions may be helpful for writing test cases for naturalToString
  // as it can be easier to think about what these functions are doing in terms
  // of strings instead of lists (i.e. if a function returns a list, call
  // compact() to make it a string to compare to a string expected value).
  // Using these are not required. See stringToNatural tests for an example.

  it('naturalToString', function() {
    // Statement Coverage: {digits: nil, base: 10} executes 1st return, 
    //                     {digits: cons(1,nil), base: 10} executes 2nd
    assert.deepStrictEqual(
        naturalToString({digits: nil, base: 10}),
        explode("0"));
    assert.deepStrictEqual(
        naturalToString({digits: cons(1,nil), base: 10}),
        explode("1"));
    // Branch Coverage: {digits: nil, base: 2} executes 1st branch, 
    //                  {digits: cons(1,nil), base: 2} executes 2nd
    // Loop Coverage: {digits: nil, base: 2} covers 0 case, 
    //                {digits: cons(1,nil), base: 2} covers 1 case
    // Loop Coverage, many case:
    assert.deepStrictEqual(
        naturalToString({digits: cons(2,cons(4, cons(6, nil))), base: 10}),
        explode("642"));
  });

  it('stringToNatural', function() {
    assert.deepStrictEqual(
        stringToNatural(explode(""), 2),
        {digits: nil, base: 2});
    assert.deepStrictEqual(
        stringToNatural(explode(""), 3),
        {digits: nil, base: 3});

    assert.deepStrictEqual(
        stringToNatural(explode("0"), 2),
        {digits: nil, base: 2});
    assert.deepStrictEqual(
        stringToNatural(explode("0"), 5),
        {digits: nil, base: 5});

    assert.deepStrictEqual(
        stringToNatural(explode("1"), 2),
        {digits: cons(1, nil), base: 2});
    assert.deepStrictEqual(
        stringToNatural(explode("F"), 16),
        {digits: cons(15, nil), base: 16});

    assert.deepStrictEqual(
        stringToNatural(explode("10"), 2),
        {digits: cons(0, cons(1, nil)), base: 2});
    assert.deepStrictEqual(
        stringToNatural(explode("11"), 2),
        {digits: cons(1, cons(1, nil)), base: 2});
    assert.deepStrictEqual(
        stringToNatural(explode("10"), 16),
        {digits: cons(0, cons(1, nil)), base: 16});
    assert.deepStrictEqual(
        stringToNatural(explode("3A"), 16),
        {digits: cons(10, cons(3, nil)), base: 16});
    assert.deepStrictEqual(
        stringToNatural(explode("5ZA"), 36),
        {digits: cons(10, cons(35, cons(5, nil))), base: 36});
  });


  // Finish tests for task 2
  it('add', function() {
    // Statement Coverage: test#1 executes the only return
    assert.deepStrictEqual(
        add({digits:cons(2,nil),base:10},{digits:nil,base:10}),
        {digits:cons(2,nil),base:10});
    // Branch Coverage (Outside while loop): test#1 executes 1st branch
    // Branch Coverage (Outside while loop): 2nd branch
    assert.deepStrictEqual(
        add({digits:nil,base:10},{digits:cons(3,nil),base:10}),
        {digits:cons(3,nil),base:10});
    // Branch coverage (Inside while loop): 1st, 2nd, 3rd, 4th branch all together
    assert.deepStrictEqual(
        add({digits:cons(3,cons(5,cons(7,nil))),base:10},{digits:cons(3,cons(9,cons(3,nil))),base:10}),
        {digits:cons(6,cons(4,cons(1,cons(1,nil)))),base:10});
    // Loop Coverage: test#1 covers 0 case
    // Loop Coverage: 1 case:
    assert.deepStrictEqual(
        add({digits:cons(2,nil),base:10},{digits:cons(1,nil),base:10}),
        {digits:cons(3,nil),base:10});
    // Loop Coverage: test#3 covers many case
  });
  
  it('numberToNatural', function() {
    assert.deepStrictEqual(numberToNatural(0, 2),
        {digits: nil, base: 2});
    assert.deepStrictEqual(numberToNatural(0, 10),
        {digits: nil, base: 10});

    assert.deepStrictEqual(numberToNatural(1, 2),
        {digits: cons(1, nil), base: 2});
    assert.deepStrictEqual(numberToNatural(15, 16),
        {digits: cons(15, nil), base: 16});

    assert.deepStrictEqual(numberToNatural(2, 2),
        {digits: cons(0, cons(1, nil)), base: 2});
    assert.deepStrictEqual(numberToNatural(3, 2),
        {digits: cons(1, cons(1, nil)), base: 2});
    assert.deepStrictEqual(numberToNatural(12, 10),
        {digits: cons(2, cons(1, nil)), base: 10});
    assert.deepStrictEqual(numberToNatural(21, 10),
        {digits: cons(1, cons(2, nil)), base: 10});

    assert.deepStrictEqual(numberToNatural(6, 2),
        {digits: cons(0, cons(1, cons(1, nil))), base: 2});
    assert.deepStrictEqual(numberToNatural(31, 2),
        {digits: cons(1, cons(1, cons(1, cons(1, cons(1, nil))))), base: 2});
    assert.deepStrictEqual(numberToNatural(32, 2),
        {digits: cons(0, cons(0, cons(0, cons(0, cons(0, cons(1, nil)))))), base: 2});
    assert.deepStrictEqual(numberToNatural(321, 10),
        {digits: cons(1, cons(2, cons(3, nil))), base: 10});
    assert.deepStrictEqual(numberToNatural(123, 10),
        {digits: cons(3, cons(2, cons(1, nil))), base: 10});
    assert.deepStrictEqual(numberToNatural(1010, 10),
        {digits: cons(0, cons(1, cons(0, cons(1, nil)))), base: 10});
  });

  it('scale', function() {
    assert.deepStrictEqual(scale({digits: nil, base: 10}, 5),
        {digits: nil, base: 10});
    assert.deepStrictEqual(scale({digits: nil, base: 3}, 2),
        {digits: nil, base: 3});

    assert.deepStrictEqual(scale({digits: cons(1, nil), base: 10}, 5),
        {digits: cons(5, nil), base: 10});
    assert.deepStrictEqual(scale({digits: cons(2, nil), base: 10}, 5),
        {digits: cons(0, cons(1, nil)), base: 10});
    assert.deepStrictEqual(scale({digits: cons(1, nil), base: 3}, 2),
        {digits: cons(2, nil), base: 3});
    assert.deepStrictEqual(scale({digits: cons(2, nil), base: 3}, 2),
        {digits: cons(1, cons(1, nil)), base: 3});

    assert.deepStrictEqual(scale({digits: cons(0, cons(2, nil)), base: 10}, 3),
        {digits: cons(0, cons(6, nil)), base: 10});
    assert.deepStrictEqual(scale({digits: cons(3, cons(0, cons(1, nil))), base: 10}, 3),
        {digits: cons(9, cons(0, cons(3, nil))), base: 10});
    assert.deepStrictEqual(scale({digits: cons(3, cons(0, cons(1, nil))), base: 10}, 9),
        {digits: cons(7, cons(2, cons(9, nil))), base: 10});
    assert.deepStrictEqual(scale({digits: cons(0, cons(1, nil)), base: 3}, 2),
        {digits: cons(0, cons(2, nil)), base: 3});
    assert.deepStrictEqual(scale({digits: cons(0, cons(1, cons(1, nil))), base: 3}, 2),
        {digits: cons(0, cons(2, cons(2, nil))), base: 3});
    assert.deepStrictEqual(scale({digits: cons(0, cons(2, cons(1, nil))), base: 3}, 2),
        {digits: cons(0, cons(1, cons(0, cons(1, nil)))), base: 3});
  });

  it('mul', function() {
    assert.deepStrictEqual(mul(
        {digits: cons(1, cons(2, cons(3, nil))), base: 10},
        {digits: nil, base: 10}),
        {digits: nil, base: 10});
    assert.deepStrictEqual(mul(
        {digits: cons(0, cons(2, cons(1, nil))), base: 3},
        {digits: nil, base: 3}),
        {digits: nil, base: 3});

    assert.deepStrictEqual(mul(
        {digits: cons(1, cons(2, cons(3, nil))), base: 10},
        {digits: cons(3, nil), base: 10}),
        {digits: cons(3, cons(6, cons(9, nil))), base: 10});
    assert.deepStrictEqual(mul(
        {digits: cons(1, cons(2, cons(3, nil))), base: 10},
        {digits: cons(4, nil), base: 10}),
        {digits: cons(4, cons(8, cons(2, cons(1, nil)))), base: 10});
    assert.deepStrictEqual(mul(
        {digits: cons(1, cons(0, cons(1, nil))), base: 3},
        {digits: cons(2, nil), base: 3}),
        {digits: cons(2, cons(0, cons(2, nil))), base: 3});
    assert.deepStrictEqual(mul(
        {digits: cons(1, cons(2, cons(1, nil))), base: 3},
        {digits: cons(2, nil), base: 3}),
        {digits: cons(2, cons(1, cons(0, cons(1, nil)))), base: 3});

    assert.deepStrictEqual(mul(
        {digits: cons(1, cons(2, cons(3, nil))), base: 10},
        {digits: cons(3, cons(4, nil)), base: 10}),
        {digits: cons(3, cons(0, cons(8, cons(3, cons(1, nil))))), base: 10});
    assert.deepStrictEqual(mul(
        {digits: cons(1, cons(2, cons(1, nil))), base: 3},
        {digits: cons(2, cons(1, nil)), base: 3}),
        {digits: cons(2, cons(2, cons(2, cons(2, nil)))), base: 3});
  });

  it('changeBase', function() {
    assert.deepStrictEqual(changeBase({digits: nil, base: 3}, 10),
        {digits: nil, base: 10});
    assert.deepStrictEqual(changeBase({digits: nil, base: 10}, 3),
        {digits: nil, base: 3});

    assert.deepStrictEqual(changeBase({digits: cons(2, nil), base: 3}, 10),
        {digits: cons(2, nil), base: 10});
    assert.deepStrictEqual(changeBase({digits: cons(8, nil), base: 10}, 3),
        {digits: cons(2, cons(2, nil)), base: 3});

    assert.deepStrictEqual(changeBase({digits: cons(2, cons(2, nil)), base: 3}, 10),
        {digits: cons(8, nil), base: 10});
    assert.deepStrictEqual(changeBase({digits: cons(8, cons(5, cons(1, nil))), base: 10}, 3),
        {digits: cons(2, cons(1, cons(2, cons(2, cons(1, nil))))), base: 3});
  });

});
