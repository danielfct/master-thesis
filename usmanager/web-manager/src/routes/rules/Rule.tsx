import React from "react";
import IData from "../../components/IData";

export interface IRule extends IData {
  name: string;
  priority: number;
  decision: IDecision;
  conditions: string[];
}

export interface IDecision extends IData {
  name: string;
  componentType: IComponentType;
}

interface IComponentType extends IData {
  name: string;
}

export interface IValueMode extends IData {
  name: string;
}

export interface IField extends IData {
  name: string;
}

export interface IOperator extends IData {
  name: string;
  symbol: string;
}
