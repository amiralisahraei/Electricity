import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function IBT() {

    const IBT_Model = input => {
        var price = 0;
        var block = 0;
        var prices = [524, 611, 1310, 2357, 2708, 3407, 3757];

        var quotient = Math.floor(input / 100);

        var remainder = input % 100;

        block = quotient;

        for (let i = 0; i < quotient; i++) {
            if (i > 6) {
                price += 100 * prices[6];
            } else {
                price += 100 * prices[i];
            }

        }


        if (quotient >= 7 && remainder !== 0) {
            if (remainder < 10) {
                price += remainder * prices[5];
            } else {
                price += (prices[6] * remainder)

            }
        }

        if (quotient < 7 && remainder !== 0) {
            block = quotient + 1;
            if (remainder < 10) {
                price += remainder * prices[quotient - 1];
            } else if (remainder > 90) {
                var difference = remainder - 90;
                price += difference * prices[quotient + 1];
                price += (remainder - difference) * prices[quotient];
            } else {
                price += remainder * prices[quotient];
            }
        }


        return {
            Block: block,
            Price: price,
            Quotient: quotient,
            Remainder: remainder
        };
    };

    const GetConsumption = () => {

        let user_consumption = document.getElementById("consumption_monthent").value;
        let days = document.getElementById("inputeDay").value;


        let consumption_per_day = user_consumption / days;
        consumption_per_day = parseFloat(consumption_per_day).toFixed(2);
        let consumption_month = consumption_per_day * 30;

        let active_blocks = [0, 0, 0, 0, 0, 0, 0];

        let block = IBT_Model(consumption_month)["Block"];
        let price = IBT_Model(consumption_month)["Price"];
        let quotient = IBT_Model(consumption_month)["Quotient"];
        let remainder = IBT_Model(consumption_month)["Remainder"];

        // console.log(block, price, quotient, remainder);

        // Determine active blocks in array
        if (quotient >= 7) {

            active_blocks = [1, 1, 1, 1, 1, 1, 1];

        } else {
            for (let i = 0; i < block; i++) {
                if (remainder !== 0 && i === block - 1) {
                    active_blocks[i] = 1.5;
                } else {
                    active_blocks[i] = 1;
                }
            }
        }

        // set the color for active blocks
        for (let i = 0; i < active_blocks.length; i++) {
            if (active_blocks[i] === 1) {
                if (i === 6) {
                    let activeBox = document.getElementById(`${i}`);
                    let textBox = document.getElementById(`textInBox${i}`);
                    activeBox.className = `box removemargin activeBox`;
                    textBox.style.display = "block";
                    textBox.innerHTML = '100 KWh';

                } else {
                    let activeBox = document.getElementById(`${i}`);
                    let textBox = document.getElementById(`textInBox${i}`);
                    activeBox.className = `box margin${i} activeBox`;
                    textBox.style.display = "block";
                    textBox.innerHTML = '100 KWh';
                }
            } else if (active_blocks[i] === 1.5) {
                if (i === 6) {
                    let activeBox = document.getElementById(`${i}`);
                    let textBox = document.getElementById(`textInBox${i}`);
                    activeBox.className = `box removemargin activeBoxYellow`;
                    textBox.style.display = "block";
                    textBox.innerHTML = `${remainder} KWh`;
                } else {
                    let activeBox = document.getElementById(`${i}`);
                    let textBox = document.getElementById(`textInBox${i}`);
                    activeBox.className = `box margin${i} activeBoxYellow`;
                    textBox.style.display = "block";
                    textBox.innerHTML = `${remainder} KWh`;
                }
            } else {
                if (i === 6) {
                    let activeBox = document.getElementById(`${i}`);
                    let textBox = document.getElementById(`textInBox${i}`);
                    activeBox.className = `box removemargin`;
                    textBox.style.display = "none";
                } else {
                    let activeBox = document.getElementById(`${i}`);
                    let textBox = document.getElementById(`textInBox${i}`);
                    activeBox.className = `box margin${i}`;
                    textBox.style.display = "none";
                }
            }
        }

        if (quotient >= 7) {
            let textBox = document.getElementById(`textInBox6`);
            textBox.innerHTML = `${(quotient - 6) * 100 + remainder} KWh`;
        }

        // Count the bill
        // for (let i = 0; i < active_blocks.length; i++) {
        //     if (active_blocks[i] === 1) {
        //         bill += (prices[i] * 100)
        //     }
        //     if (active_blocks[i] === 1.5) {
        //         bill += (prices[i] * remainder);
        //     }
        // }

        let final_bill = (price / 30) * 56;
        final_bill = parseFloat(final_bill).toFixed(2);

        document.getElementById("billTag").innerHTML = `Your bill is : ${final_bill}`;
        document.getElementById("billTag").style.display = "block";

    };

    return (
        // <>
        <div className="iBTTwoColumnscontainer">
            <div className="item displayFlex">
                <div>
                    <Link to="/" className="linkRouting linkBackHome">Home</Link>
                </div>
                <div>
                    <input
                        className="input"
                        id="consumption_monthent"
                        placeholder="enter consumption"
                    />
                    <input
                        className="input"
                        id="inputeDay"
                        placeholder="enter day"
                    /><br />
                    <button className="button" onClick={GetConsumption}>
                        Click
                    </button>
                </div>
                <div>
                    <p id="billTag" className="billBox">Your bill is : </p>
                </div>
            </div>

            <div className="item TopMargin">
                <div className="container">
                    <div className="item">
                        <div className="box margin0" id="0">
                            &lt; 100
                        </div>
                        <span className="priceBox">524 Rial</span>
                        <span className="textInBox" id="textInBox0">100 KWh</span>
                    </div>

                    <div className="item">
                        <div className="box margin1" id="1">
                            &lt; 200
                        </div>
                        <span className="priceBox">611 Rial</span>
                        <span className="textInBox" id="textInBox1">100 KWh</span>
                    </div>

                    <div className="item">
                        <div className="box margin2" id="2">
                            &lt; 300
                        </div>
                        <span className="priceBox">1310 Rial</span>
                        <span className="textInBox" id="textInBox2">100 KWh</span>
                    </div>

                    <div className="item">
                        <div className="box margin3" id="3">
                            &lt; 400
                        </div>
                        <span className="priceBox">2357 Rial</span>
                        <span className="textInBox" id="textInBox3">100 KWh</span>
                    </div>

                    <div className="item">
                        <div className="box margin4" id="4">
                            &lt; 500
                        </div>
                        <span className="priceBox">2708 Rial</span>
                        <span className="textInBox" id="textInBox4">100 KWh</span>
                    </div>

                    <div className="item">
                        <div className="box margin5" id="5">
                            &lt; 600
                        </div>
                        <span className="priceBox">3407 Rial</span>
                        <span className="textInBox" id="textInBox5">100 KWh</span>
                    </div>

                    <div className="item">
                        <div className="box removemargin" id="6">
                            600 &lt;
                        </div>
                        <span className="priceBox">3757 Rial</span>
                        <span className="textInBox" id="textInBox6">100 KWh</span>
                    </div>
                </div>
            </div>
        </div>
        // </>
    );
}

export default IBT;
