


const sampleFunc = (val) => {
  return val;
};


describe('add function', () => {
  it('for sample only', () => {
    const result = sampleFunc("Hello World");
    expect(result).toBe("Hello World");
  });


});