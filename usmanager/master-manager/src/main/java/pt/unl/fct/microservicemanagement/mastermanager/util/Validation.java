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

package pt.unl.fct.microservicemanagement.mastermanager.util;

import pt.unl.fct.microservicemanagement.mastermanager.exceptions.BadRequestException;

import java.util.Objects;

import lombok.experimental.UtilityClass;

@UtilityClass
public class Validation {

  public void validatePostRequest(Long requestBodyId) {
    if (requestBodyId != null && requestBodyId > 0) {
      throw new BadRequestException("Expected non positive request body id, instead got %d", requestBodyId);
    }
  }

  public void validatePutRequest(long pathId, Long requestBodyId) {
    if (pathId != requestBodyId) {
      throw new BadRequestException("Path id = %d and request body id = %d don't match", pathId, requestBodyId);
    }
  }

  public void validatePutRequest(String pathId, String requestBodyId) {
    if (!Objects.equals(pathId, requestBodyId)) {
      throw new BadRequestException("Path id = %s and request body id = %s don't match", pathId, requestBodyId);
    }
  }

}
