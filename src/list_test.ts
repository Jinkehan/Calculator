import * as assert from 'assert';
import {
    nil, cons, len, equal, concat, rev, compact, explode, compactList,
    removeLeading
  } from './list';

// Note: the tests provided here exceed the minimum number required by our
// course guidelines

describe('list', function() {

  it('len', function() {
    assert.deepStrictEqual(len(nil), 0n);

    assert.deepStrictEqual(len(cons(1n, nil)), 1n);
    assert.deepStrictEqual(len(cons(2n, nil)), 1n);

    assert.deepStrictEqual(len(cons(1n, cons(2n, nil))), 2n);
    assert.deepStrictEqual(len(cons(3n, cons(2n, cons(1n, cons(0n, nil))))), 4n);
  });

  it('equal', function() {
    assert.deepStrictEqual(equal(nil, nil), true);
    assert.deepStrictEqual(equal(nil, cons(1n, nil)), false);
    assert.deepStrictEqual(equal(cons(1n, nil), nil), false);
    assert.deepStrictEqual(equal(cons(1n, cons(2n, nil)), nil), false);
    assert.deepStrictEqual(equal(cons(1n, nil), cons(2n, nil)), false);
    assert.deepStrictEqual(equal(cons(7n, nil), cons(1n, cons(2n, nil))), false);

    assert.deepStrictEqual(equal(cons(3n, nil), cons(3n, nil)), true);
    assert.deepStrictEqual(equal(cons(5n, nil), cons(5n, cons(1n, nil))), false);
    assert.deepStrictEqual(equal(cons(4n, cons(1n, nil)), cons(4n, nil)), false);
    assert.deepStrictEqual(
        equal(cons(6n, cons(1n, cons(2n, nil))), cons(6n, nil)), false);
    assert.deepStrictEqual(
        equal(cons(5n, cons(1n, nil)), cons(5n, cons(2n, nil))), false);
    assert.deepStrictEqual(
        equal(cons(9n, cons(3n, nil)), cons(9n, cons(4n, cons(2n, nil)))), false);

    assert.deepStrictEqual(
        equal(cons(4n, cons(3n, nil)), cons(4n, cons(3n, nil))), true);
    assert.deepStrictEqual(
        equal(cons(7n, cons(6n, cons(1n, cons(4n, nil)))), cons(7n, cons(6n, cons(1n, cons(4n, nil))))), true);
    assert.deepStrictEqual(
        equal(cons(4n, cons(3n, cons(2n, nil))), cons(4n, cons(3n, cons(1n, cons(2n, nil))))), false);
  });

  it('concat', function() {
    assert.deepStrictEqual(concat(nil, nil), nil);
    assert.deepStrictEqual(concat(nil, cons(1n, nil)), cons(1n, nil));
    assert.deepStrictEqual(concat(nil, cons(1n, cons(2n, nil))), cons(1n, cons(2n, nil)));

    assert.deepStrictEqual(concat(cons(1n, nil), nil), cons(1n, nil));
    assert.deepStrictEqual(concat(cons(1n, nil), cons(2n, nil)), cons(1n, cons(2n, nil)));
    assert.deepStrictEqual(concat(cons(1n, nil), cons(2n, cons(3n, nil))),
        cons(1n, cons(2n, cons(3n, nil))));

    assert.deepStrictEqual(concat(cons(1n, cons(2n, nil)), nil), cons(1n, cons(2n, nil)));
    assert.deepStrictEqual(concat(cons(1n, cons(2n, nil)), cons(3n, nil)),
        cons(1n, cons(2n, cons(3n, nil))));
    assert.deepStrictEqual(concat(cons(1n, cons(2n, nil)), cons(3n, cons(4n, nil))),
        cons(1n, cons(2n, cons(3n, cons(4n, nil)))));
  });

  it('rev', function() {
    assert.deepStrictEqual(rev(nil), nil);

    assert.deepStrictEqual(rev(cons(1n, nil)), cons(1n, nil));
    assert.deepStrictEqual(rev(cons(2n, nil)), cons(2n, nil));

    assert.deepStrictEqual(rev(cons(1n, cons(2n, nil))), cons(2n, cons(1n, nil)));
    assert.deepStrictEqual(rev(cons(1n, cons(2n, cons(3n, nil)))),
        cons(3n, cons(2n, cons(1n, nil))));
  });

  it('compact', function() {
    assert.deepStrictEqual(compact(nil), "");

    assert.deepStrictEqual(compact(cons("a", nil)), "a");
    assert.deepStrictEqual(compact(cons("b", nil)), "b");
    
    assert.deepStrictEqual(compact(cons("a", cons("b", nil))), "ab");
    assert.deepStrictEqual(compact(cons("c", cons("B", cons("a", nil)))), "cBa");
  });

  it('explode', function() {
    assert.deepStrictEqual(explode(""), nil);
    
    assert.deepStrictEqual(explode("a"), cons("a", nil));
    assert.deepStrictEqual(explode("b"), cons("b", nil));
    
    assert.deepStrictEqual(explode("ab"), cons("a", cons("b", nil)));
    assert.deepStrictEqual(explode("cBa"), cons("c", cons("B", cons("a", nil))));
  });

  it('compactList', function() {
    assert.deepStrictEqual(compactList(nil), []); 
    
    assert.deepStrictEqual(compactList(cons(1n, nil)), [1n]);
    assert.deepStrictEqual(compactList(cons(8n, nil)), [8n]);
    
    assert.deepStrictEqual(compactList(cons(1n, cons(2n, nil))), [1n, 2n]);
    assert.deepStrictEqual(compactList(cons(3n, cons(2n, cons(1n, nil)))), [3n, 2n, 1n]);
  });

  it('removeLeading', function() {
    assert.deepStrictEqual(removeLeading(0, nil), nil);
    assert.deepStrictEqual(removeLeading(0, cons(1, nil)), cons(1, nil));
    assert.deepStrictEqual(removeLeading(1, cons(0, nil)), cons(0, nil));
    
    assert.deepStrictEqual(removeLeading(0, cons(0, nil)), nil);
    assert.deepStrictEqual(removeLeading(3, cons(3, cons(2, nil))), cons(2, nil));
    assert.deepStrictEqual(removeLeading(2, cons(2, cons(3, nil))), cons(3, nil));
    
    assert.deepStrictEqual(removeLeading(0, cons(0, cons(0, cons(0, nil)))), nil);
    assert.deepStrictEqual(removeLeading(5, cons(5, cons(5, cons(2, nil)))),
        cons(2, nil));
    assert.deepStrictEqual(
        removeLeading(2, cons(2, cons(2, cons(2, cons(3, cons(4, cons(5, nil))))))),
        cons(3, cons(4, cons(5, nil))));
  });

});
