import React from "react";
import IDatabaseData from "../../components/IDatabaseData";

export interface IRule extends IDatabaseData {
  name: string;
  priority: number;
  generic: boolean;
  decision: IDecision;
  conditions: string[];
}

export interface IDecision extends IDatabaseData {
  name: string;
  componentType: IComponentType;
}

interface IComponentType extends IDatabaseData {
  name: string;
}

export interface IValueMode extends IDatabaseData {
  name: string;
}

export interface IField extends IDatabaseData {
  name: string;
}

export interface IOperator extends IDatabaseData {
  name: string;
  symbol: string;
}
