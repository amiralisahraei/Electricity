import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../App.css";

function Classify() {

    let [ibtLink, setIBTLink] = useState("/IBT");

    const Classification = async () => {

        let electricity = document.getElementById("electricity").value;
        let totalConsumption = document.getElementById("totalConsumption").value;
        let location_input = document.getElementById("location").value;

        let classes = ["Agriculture", "Household", "Industrial"];
        let consumption_clusters = ['High', 'Low', 'NearHigh', "Middle"];
        let consumption_scores = [4, 1, 3, 2];

        let data = JSON.parse("[" + electricity + "]");
        // let user_location = data[0].slice(-2,);

        let send_data = {
            "user": data,
            "location": JSON.parse(location_input),
            "feeder": 14,
            "Total_Consumption": parseInt(totalConsumption)
        };

        const classification = await fetch('http://127.0.0.1:5010/classification', {
            method: 'POST',
            body: JSON.stringify(send_data),
            headers: {
                'Content-Type': 'application/json'
            },
        })

        let server_reposone = await classification.json();
        let user_class = "";
        let user_consumption_cluster = {};
        let cluster_consumption_base_regression = {};
        let knn_user_consumption_cluster = {};
        let cluster_consumption_base_decision_tree = {};
        let User_House_Price = parseInt(server_reposone["User_House_Price"]);
        let user_consumption_cluster_number = parseInt(server_reposone["Cluster_consumption"]);
        let KNN_User_Consumption_Cluster = parseInt(server_reposone["KNN_result"]);
        let Cluster_Consumption_Base_Regression = parseInt(server_reposone["Cluster_Consumption_Base_Regression"]);
        let Cluster_Consumption_Base_Decision_Tree = parseInt(server_reposone["Decision_Tree_result"]);


        // Regression result from Server
        let regressionResult = parseInt(server_reposone["Consumption_By_Price"]);
        let totalConsumptionResult = regressionResult;
        regressionResult = (regressionResult / 12).toFixed(2);

        // Detect user income level by House Price
        let user_income_level = "";
        if (User_House_Price <= 15) {
            user_income_level = "Low";
        } else if (15 < User_House_Price && User_House_Price < 18) {
            user_income_level = "Middle";
        } else {
            user_income_level = "High";
        }


        for (let i = 0; i < classes.length; i++) {
            if (i === server_reposone["Label"]) {
                user_class = classes[i];
            }
        }

        for (let i = 0; i < consumption_clusters.length; i++) {
            if (i === user_consumption_cluster_number) {
                user_consumption_cluster["label"] = consumption_clusters[i];
                user_consumption_cluster["score"] = consumption_scores[i];

            }
        }

        for (let i = 0; i < consumption_clusters.length; i++) {
            if (i === KNN_User_Consumption_Cluster) {
                knn_user_consumption_cluster["label"] = consumption_clusters[i];
                knn_user_consumption_cluster["score"] = consumption_scores[i];
            }
        }

        for (let i = 0; i < consumption_clusters.length; i++) {
            if (i === Cluster_Consumption_Base_Regression) {
                cluster_consumption_base_regression["label"] = consumption_clusters[i];
                cluster_consumption_base_regression["score"] = consumption_scores[i];
            }
        }

        for (let i = 0; i < consumption_clusters.length; i++) {
            if (i === Cluster_Consumption_Base_Decision_Tree) {
                cluster_consumption_base_decision_tree["label"] = consumption_clusters[i];
                cluster_consumption_base_decision_tree["score"] = consumption_scores[i];
            }
        }


        // Put server response in Html Tags

        document.getElementById("userHousePrice").innerHTML = `House Price: ${User_House_Price}`;
        document.getElementById("userHousePrice").style.display = "block";

        document.getElementById("userIncomeLevel").innerHTML = `Income Level: ${user_income_level}`;
        document.getElementById("userIncomeLevel").style.display = "block";

        document.getElementById("userClass").innerHTML = `User Type : ${user_class}`;
        document.getElementById("userClass").style.display = "block";

        document.getElementById("userConsumptionCluster").innerHTML = `Consumption Cluster: ${user_consumption_cluster["label"]}`;
        document.getElementById("userConsumptionCluster").style.display = "block";

        document.getElementById("userConsumptionYearsBasedPrice").innerHTML = `2 Years Consumption Based on Reg: ${totalConsumptionResult}`;
        document.getElementById("userConsumptionYearsBasedPrice").style.display = "block";

        document.getElementById("userConsumptionMonthsBasedPrice").innerHTML = `2 Months Consumption Based on Reg: ${regressionResult}`;
        document.getElementById("userConsumptionMonthsBasedPrice").style.display = "block";

        document.getElementById("userConumptionKNN").innerHTML = `KNN cluster: ${knn_user_consumption_cluster["label"]}`;
        document.getElementById("userConumptionKNN").style.display = "block";

        document.getElementById("userConumptionClusterRegression").innerHTML = `Regression cluster: ${cluster_consumption_base_regression["label"]}`;
        document.getElementById("userConumptionClusterRegression").style.display = "block";

        document.getElementById("userConumptionClusterDecistionTree").innerHTML = `Nearest Center cluster: ${cluster_consumption_base_decision_tree["label"]}`;
        document.getElementById("userConumptionClusterDecistionTree").style.display = "block";



        // Find the most highest in array for enseble model
        function highest(arr) {

            let result = []
            for (let i = 0; i < arr.length; i++) {
                result.push(arr.filter(x => x === arr[i]).length)
            }

            let the_same = false

            for (let i = 0; i < result.length; i++) {
                if (result[i] === 1) {
                    the_same = true
                }
            }

            if (the_same === true) {
                return arr[0];
            }
            else {
                const hashmap = arr.reduce((acc, val) => {
                    acc[val] = (acc[val] || 0) + 1
                    return acc
                }, {})
                return Object.keys(hashmap).reduce((a, b) => hashmap[a] > hashmap[b] ? a : b)
            }

        }

        let ensemble_array = [
            KNN_User_Consumption_Cluster,
            Cluster_Consumption_Base_Regression,
            Cluster_Consumption_Base_Decision_Tree
        ]

        let ensemble_model_result = {};
        let Ensemble_Model_Result = parseInt(highest(ensemble_array));

        for (let i = 0; i < consumption_clusters.length; i++) {
            if (i === Ensemble_Model_Result) {
                ensemble_model_result["label"] = consumption_clusters[i];
                ensemble_model_result["score"] = consumption_scores[i];
            }
        }

        document.getElementById("ensembleResult").innerHTML = `Ensemble model result: ${ensemble_model_result["label"]}`;
        document.getElementById("ensembleResult").style.display = "block";

        // Detect Anomaly Detection
        let anomaly_value = "";
        let deifference_real_ensemble_mode = Math.abs(ensemble_model_result["score"] - user_consumption_cluster["score"]);
        if (deifference_real_ensemble_mode <= 1) {
            anomaly_value = false;
        } else {
            anomaly_value = true;
        }

        // Set the IBT page link based on Anomaly and User income level
        if (user_income_level === "Low" && anomaly_value === false) {
            setIBTLink("/Low_Income_IBT");
        }

        document.getElementById("anomalyValue").innerHTML = `Anomaly value: ${anomaly_value}`;
        document.getElementById("anomalyValue").style.display = "block";

        // Request for X,Y plot based on consumption
        const clustering = await fetch('http://127.0.0.1:5010/clustering_consumption', {
            method: 'POST',
            body: JSON.stringify(send_data),
            headers: {
                'Content-Type': 'application/json'
            },
        })

        let picture = await clustering.blob();
        let objectURL = URL.createObjectURL(picture);

        document.getElementById("image").src = objectURL;
        document.getElementById("image").style.display = "block";
        document.getElementById("imageTitleConsumption").style.display = "block";

        // Request for Bar plot
        const clustering_bar = await fetch('http://127.0.0.1:5010/clustering_consumption_bar', {
            method: 'POST',
            body: JSON.stringify(send_data),
            headers: {
                'Content-Type': 'application/json'
            },
        })

        let picture_bar = await clustering_bar.blob();
        let objectURL_bar = URL.createObjectURL(picture_bar);
        document.getElementById("image_bar").src = objectURL_bar;
        document.getElementById("image_bar").style.display = "block";
        document.getElementById("imageTitleBar").style.display = "block";

        // Request for Bar plot
        const cycle_bar = await fetch('http://127.0.0.1:5010/cycle_bar', {
            method: 'POST',
            body: JSON.stringify(send_data),
            headers: {
                'Content-Type': 'application/json'
            },
        })

        let picture_cycle_bar = await cycle_bar.blob();
        let objectURL_cycle_bar = URL.createObjectURL(picture_cycle_bar);
        document.getElementById("image_cycle").src = objectURL_cycle_bar;
        document.getElementById("image_cycle").style.display = "block";
        document.getElementById("imageTitleCycle").style.display = "block";


        // Request for X,Y plot based on location
        const clustering_location = await fetch('http://127.0.0.1:5010/clustering_location', {
            method: 'POST',
            body: JSON.stringify(send_data),
            headers: {
                'Content-Type': 'application/json'
            },
        })

        let picture_location = await clustering_location.blob();
        let objectURL_location = URL.createObjectURL(picture_location);

        document.getElementById("image_kmeans_location").src = objectURL_location;
        document.getElementById("image_kmeans_location").style.display = "block";
        document.getElementById("imageTitleLocation").style.display = "block";


    }

    return (
        <>
            <div className="mainTwoColumnsContainer">
                <div className="item LeftColumn">
                    <div>
                        <Link to="/" ><button className="button">Home</button></Link>
                        <Link to={ibtLink} ><button className="button ibtButton">IBT</button></Link>
                        <input id="totalConsumption" className="input" placeholder="total consumption" />
                        <input id="electricity" className="input" placeholder="electricity array" />
                        <input id="location" className="input" placeholder="location" /><br />
                        <button className="button" onClick={Classification}>
                            Click
                        </button>
                        <div className="twoColumnscontainer">
                            <div className="item" id="userHousePrice"></div>
                            <div className="item" id="userIncomeLevel"></div>
                            <div className="item" id="userClass"></div>
                            <div className="item" id="userConsumptionCluster"></div>
                            <div className="item" id="userConumptionKNN"></div>
                            <div className="item" id="anomalyValue"></div>
                            <div className="item displayNone" id="userConsumptionYearsBasedPrice"></div>
                            <div className="item displayNone" id="userConsumptionMonthsBasedPrice"></div>
                            <div className="item displayNone" id="userConumptionClusterRegression"></div>
                            <div className="item displayNone" id="userConumptionClusterDecistionTree"></div>
                            <div className="item displayNone" id="ensembleResult"></div>
                        </div>
                    </div><br />
                </div>
                <div className="item RightColumn">

                    <div>
                        <div><h4 id="imageTitleConsumption" className="imageTitle">Electricity Consumption Clsuters Map</h4></div>
                        <img id="image" className="image" alt="electrcitiy_consumption_cluster" />
                    </div>

                    <div>
                        <div><h4 id="imageTitleBar" className="imageTitle">Electricity Consumption Clsuters Density</h4></div>
                        <img id="image_bar" className="image" alt="consumption_clusters_bar" />
                    </div>

                    <div>
                        <div><h4 id="imageTitleCycle" className="imageTitle">Cycle Bar Clsuters Density</h4></div>
                        <img id="image_cycle" className="image image_cycle" alt="cycle_clusters_bar" />
                    </div>


                    <div>
                        <div><h4 id="imageTitleLocation" className="imageTitle">Subscribers Location Map</h4></div>
                        <img id="image_kmeans_location" className="image" alt="location_clustering" />
                    </div>

                </div>
            </div>
        </>
    );
}

export default Classify;
