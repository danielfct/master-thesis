/*
 * MIT License
 *
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package pt.unl.fct.microservicemanagement.mastermanager.manager.operators;

import java.util.HashMap;
import java.util.Map;

public enum Operator {

  NOT_EQUAL_TO("NOT_EQUAL_TO"),
  EQUAL_TO("EQUAL_TO"),
  GREATER_THAN("GREATER_THAN"),
  LESS_THAN("LESS_THAN"),
  GREATER_THAN_OR_EQUAL_TO("GREATER_THAN_OR_EQUAL_TO"),
  LESS_THAN_OR_EQUAL_TO("LESS_THAN_OR_EQUAL_TO");

  private static Map<String, Operator> constants;

  private final String value;

  static {
    constants = new HashMap<>();
    for (Operator c : values()) {
      constants.put(c.value, c);
    }
  }

  Operator(String value) {
    this.value = value;
  }

  @Override
  public String toString() {
    return this.value;
  }

  public static Operator fromValue(String value) {
    Operator constant = constants.get(value);
    if (constant == null) {
      throw new IllegalArgumentException(value);
    } else {
      return constant;
    }
  }

}
