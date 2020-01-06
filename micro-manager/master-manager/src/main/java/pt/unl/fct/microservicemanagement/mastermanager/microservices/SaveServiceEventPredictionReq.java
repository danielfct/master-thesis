/*
 * MIT License
 *
 * Copyright (c) 2020 micro-manager
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

package pt.unl.fct.microservicemanagement.mastermanager.microservices;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;

import lombok.Data;
import org.springframework.util.StringUtils;

@Data
class SaveServiceEventPredictionReq {

  private final long serviceId;
  private final String description;
  private final String startDate;
  private final String startTime;
  private final String endDate;
  private final String endTime;
  private final int minReplics;

  public Timestamp getStartDateTimeStamp() {
    int count = StringUtils.countOccurrencesOf(startTime, ":");
    String saveStartTime = count == 1 ? startTime + ":00" : startTime;
    return getTimeStamp(startDate, saveStartTime);
  }

  public Timestamp getEndDateTimeStamp() {
    int count = StringUtils.countOccurrencesOf(endTime, ":");
    String saveEndTime = count == 1 ? endTime + ":00" : endTime;
    return getTimeStamp(endDate, saveEndTime);
  }

  private Timestamp getTimeStamp(String date, String time) {
    Timestamp timestamp = new Timestamp(System.currentTimeMillis());
    SimpleDateFormat simpleStartDate = new SimpleDateFormat("dd-MM-yyyy hh:mm:ss");
    try {
      Instant instant = simpleStartDate.parse(date + " " + time).toInstant();
      timestamp = Timestamp.from(instant);
    } catch (ParseException e) {
      e.printStackTrace();
    }
    return timestamp;
  }

}
