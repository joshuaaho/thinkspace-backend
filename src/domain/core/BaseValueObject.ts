import valueEqual from "value-equal";

/**
 * @desc ValueObjects are objects that we determine their
 * equality through their structural properties.
 */
abstract class ValueObject {
  public equals(vo?: ValueObject): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    return valueEqual(this, vo);
  }
}

export default ValueObject;
