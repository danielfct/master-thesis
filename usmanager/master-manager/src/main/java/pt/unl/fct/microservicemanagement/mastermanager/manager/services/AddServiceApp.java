package pt.unl.fct.microservicemanagement.mastermanager.manager.services;

import lombok.Data;

@Data
public class AddServiceApp {

  //TODO replace with @json

  private final String name;
  private final int launchOrder;

}
