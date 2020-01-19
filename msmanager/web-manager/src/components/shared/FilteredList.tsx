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

    public render() {
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
