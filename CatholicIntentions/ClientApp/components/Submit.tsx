import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { SubmitPrayer } from '../interfaces';
import firebase from '../firebase';


export class Submit extends React.Component<RouteComponentProps<{}>, SubmitPrayer>{
    dbItemsRef: firebase.database.Reference;
    recaptchaInstance: any;
    minimumLength: number = 15;
    submissionTimeout: number = 8; // 8 seconds
    timer: number = 0;
    tick(arg0: any, arg1: any): any {

        var lastSubmission = window.localStorage.getItem("CIS");

        if (lastSubmission !== null) {            
            if ((Date.now() - parseInt(lastSubmission, 10)) > (this.submissionTimeout * 1000)) {                
                this.setState({
                    timeout: false
                });
            }
        }
    }

    constructor() {
        super();
        this.state = {
            prayer: "",
            time: "",
            errors: false,
            success: false,
            timeout: false,
        };

        this.dbItemsRef = this.getRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);        
    }

    componentWillMount() {
        this.timer = setInterval(this.tick.bind(this), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        this.dbItemsRef.off();
    }

    getRef() {
        return firebase.database().ref("prayers");
    }     

    handleChange(e:any) {
        this.setState({
            [e.target.name]: e.target.value,
            success: false
        });
    }

    handleSubmit(e: any) {
        e.preventDefault();
        
        let now = Date.now();
        
        if (this.state.prayer.length < this.minimumLength) {
            this.setState({
                errors: true
            });
        } else {

            // Only submit if not on timeout
            let last: any = window.localStorage.getItem("CIS");            
            if (last != null) {
                last = parseInt(last, 10);
                
                if (Date.now() - last > (this.submissionTimeout * 1000)) {
                    this.setState({
                        timeout: false
                    });
                } else {
                    this.setState({
                        timeout: true
                    });
                }
            }

            if (!this.state.timeout) {

                // submit to firebase
                const item = {
                    p: this.state.prayer,
                    t: now.toString(),
                    r: "0",
                    r_t: "0" + now.toString()
                };
                this.dbItemsRef.push(item);

                this.setState({
                    prayer: "",
                    time: "",
                    errors: false,
                    success: true,
                    timeout: true
                });

                // Set timeout for another submission;
                // CIS - catholic intention submission
                window.localStorage.setItem("CIS", (Date.now()).toString());
            }            
        }
    }

    renderMessage() {
        
        if (this.state.success) {
            return <div>
                Prayer submitted!                
            </div>;
        } else if (this.state.timeout) {
            return <div>
                Please hold on for a few seconds before submitting your next prayer request
            </div>;
        }

        let remaining = this.minimumLength - this.state.prayer.length;
        
        if (!this.state.errors || remaining <= 0) {
            return <div></div>;
        } else {

            return <div>
                Please enter at least {remaining} more characters
            </div>
        }
    }

    render() {
        return <div>            
            <form id="form" onSubmit={this.handleSubmit}>
                <textarea className="prayer-landing-pad" name="prayer" onChange={this.handleChange} value={this.state.prayer}></textarea><br />
                {this.renderMessage()}
                <button className="ci-button">Submit prayer request</button>
            </form>
        </div>;
    }    
}