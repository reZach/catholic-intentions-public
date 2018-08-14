import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { PrayersState, Prayer } from '../interfaces';
import firebase from '../firebase';
var Swiper:any = require('react-id-swiper');


export class Prayers extends React.Component<RouteComponentProps<{}>, PrayersState>{
    dbItemsRef: firebase.database.Reference;
    tick(arg0: any, arg1: any): any {

        if (this.state.lastUpdated) {
            this.setState({ timeRemaining: Date.now() - parseInt(this.state.lastUpdated) });
        }        
    }
    timer: number;
    lastPrayerTimestamp: string;
    swiper: any;
    canUpdateSlider: boolean = true;
    prayerSet: number = 10; // number of prayers that are loaded in a set
    prayerRefreshTimeout: number = 15; // in seconds
    localStorageTimestampKey: string = "CIT"; // Catholic Intentions timestamp


    constructor() {
        super();

        let last = window.localStorage.getItem("CITs");
        if (last != null) {
            last = parseInt(last, 10).toString();
        } else {
            last = Date.now().toString();
        }
        this.state = { prayers: [], lastUpdated: last, timeRemaining: 0 };

        this.dbItemsRef = this.getRef();
        this.tick = this.tick.bind(this);
        this.moveDesktopSliderPrev = this.moveDesktopSliderPrev.bind(this);
        this.moveDesktopSliderNext = this.moveDesktopSliderNext.bind(this);
    }

    componentWillMount() {

        this.queryPrayers(this.prayerSet, 0);
        this.timer = setInterval(this.tick, 1000);

        if (this.swiper) {
            this.swiper.on('slideChange', function (e:any) {
                console.log('slide changed' + e);
            });
        }
    }

    componentWillUnmount(){
        this.dbItemsRef.off();
        clearInterval(this.timer);
    }

    getRef() {
        return firebase.database().ref("prayers");
    }

    // Query for prayers
    queryPrayers(num: number, startingAt: any, backToSlideOne: boolean = false) {
        
        let _ = this;

        if (typeof startingAt === "number") {
            this.dbItemsRef.orderByChild("r_t").startAt(startingAt).limitToLast(num).on('value', (snapshot) => {

                if (snapshot != null) {
                    var date;
                    var whole = snapshot.val();
                    var collection: Prayer[] = [];

                    if (whole != null) {
                        let parsedTime;
                        let earliestPrayerTime = Infinity;
                        Object.keys(whole).forEach(function (e) {

                            // if prayer has been reviewed
                            if (whole[e].r === "1") {
                                parsedTime = parseInt(whole[e].t, 10);
                                if (parsedTime < earliestPrayerTime) {
                                    earliestPrayerTime = parsedTime;
                                }

                                date = new Date(parsedTime);
                                collection.push({
                                    k: e,
                                    p: whole[e].p,
                                    t: date.toDateString(),
                                    r: whole[e].r,
                                    r_t: whole[e].r_t
                                });
                            }                            
                        });

                        collection.reverse();
                        let updateTime = Date.now();
                        _.setState({
                            prayers: collection,
                            lastUpdated: updateTime.toString()
                        });

                        if (backToSlideOne) {
                            if (this.swiper) {                                
                                this.swiper.slideTo(0);
                                this.swiper.update();
                            }
                        }
                        
                        _.lastPrayerTimestamp = earliestPrayerTime.toString();

                        window.localStorage.setItem("CITs", updateTime.toString());
                        this.canUpdateSlider = true;
                    }
                }                
            });
        } else {
            startingAt = "1" + startingAt;

            this.dbItemsRef.orderByChild("r_t").endAt(startingAt).limitToLast(num).on('value', (snapshot) => {

                if (snapshot != null) {
                    var date;
                    var whole = snapshot.val();
                    var collection: Prayer[] = [];

                    if (whole != null) {
                        let parsedTime;
                        let earliestPrayerTime = Infinity;
                        Object.keys(whole).forEach(function (e) {

                            // if prayer has been reviewed
                            if (whole[e].r === "1") {
                                parsedTime = parseInt(whole[e].t, 10);
                                if (parsedTime < earliestPrayerTime) {
                                    earliestPrayerTime = parsedTime;
                                }

                                date = new Date(parsedTime);
                                collection.push({
                                    k: e,
                                    p: whole[e].p,
                                    t: date.toDateString(),
                                    r: whole[e].r,
                                    r_t: whole[e].r_t
                                });
                            }
                        });


                        collection.reverse();
                        let updateTime = Date.now();
                        let nextPrayerSlideIndex = this.state.prayers.length - 1;
                        
                        let newPrayers = this.state.prayers.concat(collection);                        
                        
                        _.setState({
                            prayers: newPrayers,
                            lastUpdated: updateTime.toString()
                        });

                        if (collection.length > 0) {
                            nextPrayerSlideIndex++;
                        }

                        if (this.swiper) {
                            this.swiper.update();
                            this.swiper.slideTo(nextPrayerSlideIndex);
                        }

                        _.lastPrayerTimestamp = earliestPrayerTime.toString();

                        window.localStorage.setItem("CITs", updateTime.toString());
                        this.canUpdateSlider = true;
                    }
                }
            });
        }        
    }

    moveDesktopSliderPrev() {
        if (this.swiper) {
            this.swiper.slidePrev();
        }
    }

    moveDesktopSliderNext() {
        if (this.swiper) {
            this.swiper.slideNext();
        }
    }

    infoContainer() {

        let mobile = ('ontouchstart' in document.documentElement);

        if (mobile) {
            return <div>
                Swipe from right to left to load more prayers
            </div>;
        } else {
            return <div>
                <button className="ci-button swiper-previous" onClick={this.moveDesktopSliderPrev}>Previous</button>
                <button className="ci-button swiper-next" onClick={this.moveDesktopSliderNext}>Next</button>
            </div>;
        }        
    }

    timeRemainingSlide() {
        let remaining = this.prayerRefreshTimeout - (~~(this.state.timeRemaining / 1000));
        let nextPrayers:string = (parseInt(this.lastPrayerTimestamp, 10) - 1).toString();
        
        if (remaining > 0) {
            return <div className="prayer">
                You've reached the end of our feed,
                please wait {remaining} seconds before more 
                prayers are loaded
            </div>;
        } else {

            if (this.swiper) {
                if (this.swiper.isEnd && this.canUpdateSlider) {

                    this.canUpdateSlider = false;
                    this.queryPrayers(this.prayerSet, nextPrayers, false);
                }
            }
            return <div></div>;
        }
    }

    renderPrayers(prayers: Prayer[]) {        

        // Swiper config
        var config = {
            navigation: {
                nextEl: '.swiper-next',
                prevEl: '.swiper-previous'
            },
            scrollbar: {
                el: '.swiper-scrollbar',
                hide: true,
            },
            mousewheel: false
        };

        if (prayers.length == 0) {
            return <div> 
                We seem to have misplaced our list of prayers!
                Try refreshing the page.
            </div>;
        } else {

            return <div>
                <Swiper {...config} ref={(node: any) => { if (node) { this.swiper = node.swiper } }}>
                    {prayers.map((p, i) =>
                        <div key={i} className="prayer">
                            <div>{p.p}</div><br />
                            <div>{p.t}</div>
                        </div>
                    )}
                    {this.timeRemainingSlide()}
                </Swiper>
                {this.infoContainer()}
            </div>;
        }
    }

    render() {
        return <div>
            {this.renderPrayers(this.state.prayers)}
        </div>;
    }
}