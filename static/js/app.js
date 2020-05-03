// Function for Data plotting (Bar, gauge, bubbles)
function getPlot(id) {

    // Get data from the json file
    d3.json("./Data/samples.json").then((data)=> {
        console.log(data)
  
        var wfreq = data.metadata.map(d => d.wfreq)
        // console.log(`Washing Freq: ${wfreq}`)
        
        // Filter sample values by id 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        
        console.log(samples);
  
        // Getting the top 10 
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
  
        // Top 10 otu ids for the plot OTU and reverse 
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        
        // Get the otu id's to the desired form for the plot
        var OTU_id = OTU_top.map(d => "OTU " + d)
  
  
        // Top 10 labels for the plot
        var labels = samples.otu_labels.slice(0, 10);
  
     
        // Variable for the plot
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'rgb(142,124,195)'},
            type:"bar",
            orientation: "h",
        };
  
        // Data variable
        var data = [trace];
  
        // Layout variable to set plots layout
        var layout = {
            title: "<b>Top 10 OTUs",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            },
            font: { color: "black", family: "Montserrat"},

        };
  
        // Bar plot
        Plotly.newPlot("bar", data, layout);
  
             
        // Bubble chart
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
  
        };
  
        // Layout for the bubble plot
        var layout_b = {
            title: { text: `<b>Handful of microbial species (OTUs)` },
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000,
            font: { color: "black", family: "Montserrat"},
        };
  
        // Data variable 
        var data1 = [trace1];
  
        // create the bubble plot
        Plotly.newPlot("bubble", data1, layout_b); 
  
        // Gauge chart
  
        var data_gauge = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(wfreq),
          title: { text: `<b>Belly Button Washing Frequency</b> <br> Scrubs per week` },
          type: "indicator",
          
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                   steps: [
                    { range: [0, 2], color: "lime" },
                    { range: [2, 4], color: "cyan" },
                    { range: [4, 6], color: "teal" },
                    { range: [6, 8], color: "pink" },
                    { range: [8, 9], color: "darkviolet" },
                  ]}
              
          }
        ];
        var layout_g = { 
            width: 700, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 }, 
            // paper_bgcolor: "lavender",
            font: { color: "black", family: "Montserrat"},
          };
        Plotly.newPlot("gauge", data_gauge, layout_g);
      });
  }  
// Get the necessary data
function getInfo(id) {

    // Reading json file to get data
    d3.json("./Data/samples.json").then((data)=> {
        
        // Metadata info for the demographic panel
        var metadata = data.metadata;

        console.log(metadata)

        // Filter meta data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // Selecting demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");
        
        // Empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // Demographic data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// Change event function
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

// Initial data rendering
function init() {

    var dropdown = d3.select("#selDataset");

    // Read the data 
    d3.json("./Data/samples.json").then((data)=> {
        console.log(data)

        //Passing ID to the dropdown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // Display the data and the plots
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();