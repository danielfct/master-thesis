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

package pt.unl.fct.microservicemanagement.mastermanager.host.edge;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
@Entity
@Table(name = "edge_host")
public class EdgeHost {

  @Id
  @GeneratedValue
  private Long id;

  @Column(name = "hostname", unique = true)
  private String hostname;

  @Column(name = "ssh_username")
  private String sshUsername;

  // Base64 format
  @Column(name = "ssh_password")
  private String sshPassword;

  // AWS region
  @Column(name = "region")
  private String region;

  @Column(name = "country")
  private String country;

  @Column(name = "city")
  private String city;

  @Column(name = "is_local")
  private boolean isLocal;

  public EdgeHost(String hostname, String sshUsername, String sshPassword,
                  String region, String country, String city, boolean isLocal) {
    this.hostname = hostname;
    this.sshUsername = sshUsername;
    this.sshPassword = sshPassword;
    this.region = region;
    this.country = country;
    this.city = city;
    this.isLocal = isLocal;
  }

}
