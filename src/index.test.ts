import { hi } from ".";

test('two plus two is four', () => {
    expect(2 + 2).toBe(4);
});

test('hi() returns a string containing "IGM"', () => {
    expect(hi()).toContain("IGM");
});