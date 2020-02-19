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

import * as React from "react";
import {Form, FormControl, FormGroup, Glyphicon, InputGroup} from "react-bootstrap";
import {PagedList} from "./PagedList";

interface ISearchableList<T> {
    list:T[];
    select:(x:T) => void;
    show:(x:T) => JSX.Element;
    page?:number;
    pagesize?:number;
    predicate: (x:T,s:string) => boolean
}

export class FilteredList<T> extends React.Component<ISearchableList<T>,{search:string}> {
    constructor(props:ISearchableList<T>) {
        super(props);
        this.state = {search:''};
    }

    render() {
        const {list, predicate, ...otherprops} = this.props;

        return (
            <Form>
            <FormGroup>
                <InputGroup>
                    <FormControl type="text" value={this.state.search} onChange={this.setValue}/>
                    <InputGroup.Addon>
                        <Glyphicon glyph="search" />
                    </InputGroup.Addon>
                </InputGroup>
            </FormGroup>

              <PagedList {...otherprops}
                         list={list.filter((s:T)=>predicate(s,this.state.search))}/>

            </Form>
        );
    }

    private setValue = ({target:{value}}:any) => this.setState({search:value});
}
