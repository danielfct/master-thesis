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

export interface ICondition extends IData {
  name: string;
  valueMode: IValueMode;
  field: IField;
  operator: IOperator;
  value: number;
}

interface IValueMode extends IData {
  name: string;
}

interface IField extends IData {
  name: string;
}

interface IOperator extends IData {
  name: string;
  symbol: string;
}
