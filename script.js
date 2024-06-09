document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        var username = document.getElementById('loginUsername').value;
        var password = document.getElementById('loginPassword').value;

        if (username === 'admin' && password === 'admin') {
            document.getElementById('loginFormContainer').style.display = 'none';
            document.getElementById('mainContent').style.display = 'block';
        } else {
            alert('Username atau password salah!');
        }
    });

    document.getElementById('hamburger').addEventListener('click', function() {
        var navLinks = document.getElementById('nav-links');
        if (navLinks.style.display === 'block') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'block';
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");

    hamburger.addEventListener("click", function() {
        navLinks.classList.toggle("active");
    });
        
    fetch('AOVF.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load file');
            }
            return response.json();
        })
        .then(data => {
            const aovCtx = document.getElementById('aovfChart').getContext('2d');
            new Chart(aovCtx, {
                type: 'line',
                data: {
                    labels: data.map((element) => element.Tahun),
                    datasets: [
                        {
                            label: 'Average Order Value (AOV)',
                            data: data.map((element) => element.AOV),
                            borderWidth: 1,
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
                            borderColor: 'rgba(255, 159, 64, 1)'
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'AOV'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error loading the data:', error);
        });
});

document.addEventListener('DOMContentLoaded', function() {
    const chartContainer = document.getElementById('chartContainer');

    const chartSelect = document.createElement('select');
    chartSelect.id = 'chartSelect';
    chartContainer.appendChild(chartSelect);

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Select a chart';
    chartSelect.appendChild(defaultOption);

    const syOption = document.createElement('option');
    syOption.value = 'syChart';
    syOption.text = 'Total Profit Chart';
    chartSelect.appendChild(syOption);

    const aovsOption = document.createElement('option');
    aovsOption.value = 'aovsChart';
    aovsOption.text = 'Average Order Value Chart';
    chartSelect.appendChild(aovsOption);

    const sortSelect = document.createElement('select');
    sortSelect.id = 'sortSelect';
    chartContainer.appendChild(sortSelect);

    const ascOption = document.createElement('option');
    ascOption.value = 'asc';
    ascOption.text = 'Ascending';
    sortSelect.appendChild(ascOption);

    const descOption = document.createElement('option');
    descOption.value = 'desc';
    descOption.text = 'Descending';
    sortSelect.appendChild(descOption);

    const attributeSelect = document.createElement('select');
    attributeSelect.id = 'attributeSelect';
    chartContainer.appendChild(attributeSelect);

    const yearOption = document.createElement('option');
    yearOption.value = 'Year';
    yearOption.text = 'Year';
    attributeSelect.appendChild(yearOption);

    const valueOption = document.createElement('option');
    valueOption.value = 'Value';
    valueOption.text = 'Value';
    attributeSelect.appendChild(valueOption);

    const syChartCanvas = document.createElement('canvas');
    syChartCanvas.id = 'syChart';
    syChartCanvas.style.display = 'none';
    chartContainer.appendChild(syChartCanvas);

    const aovsChartCanvas = document.createElement('canvas');
    aovsChartCanvas.id = 'aovsChart';
    aovsChartCanvas.style.display = 'none';
    chartContainer.appendChild(aovsChartCanvas);

    let syChart, aovsChart;

    chartSelect.addEventListener('change', function() {
        updateChart();
    });

    sortSelect.addEventListener('change', function() {
        updateChart();
    });

    attributeSelect.addEventListener('change', function() {
        updateChart();
    });

    function updateChart() {
        const selectedValue = chartSelect.value;
        const sortMethod = sortSelect.value;
        const sortAttribute = attributeSelect.value;

        syChartCanvas.style.display = 'none';
        aovsChartCanvas.style.display = 'none';

        if (selectedValue === 'syChart') {
            syChartCanvas.style.display = 'block';
            fetch('sy.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load file');
                    }
                    return response.json();
                })
                .then(data => {
                    data = sortData(data, sortMethod, sortAttribute, 'Total_Profit');
                    const ctx = syChartCanvas.getContext('2d');
                    const segments = ['Consumer', 'Corporate', 'Home Office'];
                    const colors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(75, 192, 192)'];
                    const datasets = segments.map((segment, index) => {
                        const segmentData = data.filter(item => item.Segment === segment);
                        return {
                            label: `${segment} - Total Profit`,
                            data: segmentData.map(item => item.Total_Profit),
                            borderWidth: 3,
                            fill: false,
                            borderColor: colors[index % colors.length]
                        };
                    });

                    if (syChart) {
                        syChart.destroy();
                    }

                    syChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: data.filter(item => item.Segment === 'Consumer').map(item => item.Year),
                            datasets: datasets
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Total Profit'
                                    }
                                }
                            }
                        }
                    });
                })
                .catch(error => {
                    console.error('Error loading the data:', error);
                });
        } else if (selectedValue === 'aovsChart') {
            aovsChartCanvas.style.display = 'block';
            fetch('sy.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load file');
                    }
                    return response.json();
                })
                .then(data => {
                    data = sortData(data, sortMethod, sortAttribute, 'Average_Order_Value');
                    const ctx = aovsChartCanvas.getContext('2d');
                    const segments = ['Consumer', 'Corporate', 'Home Office'];
                    const colors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(75, 192, 192)'];
                    const datasets = segments.map((segment, index) => {
                        const segmentData = data.filter(item => item.Segment === segment);
                        return {
                            label: `${segment} - Average Order Value`,
                            data: segmentData.map(item => item.Average_Order_Value),
                            borderWidth: 2,
                            borderColor: colors[index % colors.length],
                            backgroundColor: colors[index % colors.length],
                            fill: true
                        };
                    });

                    if (aovsChart) {
                        aovsChart.destroy();
                    }

                    aovsChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: data.filter(item => item.Segment === 'Consumer').map(item => item.Year),
                            datasets: datasets
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Average Order Value'
                                    }
                                }
                            }
                        }
                    });
                })
                .catch(error => {
                    console.error('Error loading the data:', error);
                });
        }
    }

    function sortData(data, sortMethod, sortAttribute, valueKey) {
        const attributeKey = sortAttribute === 'Year' ? 'Year' : valueKey;
        const sortedData = data.sort((a, b) => {
            if (sortMethod === 'asc') {
                return a[attributeKey] - b[attributeKey];
            } else {
                return b[attributeKey] - a[attributeKey];
            }
        });
        return sortedData;
    }

    updateChart();
});

function sortData(data, sortMethod, sortAttribute, valueKey) {
    const attributeKey = sortAttribute === 'Year' ? 'Year' : valueKey;
    const sortedData = data.sort((a, b) => {
        if (sortMethod === 'asc') {
            if (typeof a[attributeKey] === 'string') {
                return a[attributeKey].localeCompare(b[attributeKey]);
            } else {
                return a[attributeKey] - b[attributeKey];
            }
        } else {
            if (typeof a[attributeKey] === 'string') {
                return b[attributeKey].localeCompare(a[attributeKey]);
            } else {
                return b[attributeKey] - a[attributeKey];
            }
        }
    });
    return sortedData;
}

document.addEventListener('DOMContentLoaded', function() {
    const chartContainer2 = document.getElementById('chartContainer2');

    const chartSelect = document.createElement('select');
    chartSelect.id = 'chartSelect';
    chartContainer2.appendChild(chartSelect);

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Select a chart';
    chartSelect.appendChild(defaultOption);

    const sctpOption = document.createElement('option');
    sctpOption.value = 'sctpChart';
    sctpOption.text = 'Sub-Category Total Profit Chart';
    chartSelect.appendChild(sctpOption);

    const scadOption = document.createElement('option');
    scadOption.value = 'scadChart';
    scadOption.text = 'Sub-Category Average Discount Chart';
    chartSelect.appendChild(scadOption);

    const scaovOption = document.createElement('option');
    scaovOption.value = 'scaovChart';
    scaovOption.text = 'Sub-Category Average Order Value Chart';
    chartSelect.appendChild(scaovOption);

    const sortSelect = document.createElement('select');
    sortSelect.id = 'sortSelect';
    chartContainer2.appendChild(sortSelect);

    const ascOption = document.createElement('option');
    ascOption.value = 'asc';
    ascOption.text = 'Ascending';
    sortSelect.appendChild(ascOption);

    const descOption = document.createElement('option');
    descOption.value = 'desc';
    descOption.text = 'Descending';
    sortSelect.appendChild(descOption);

    const attributeSelect = document.createElement('select');
    attributeSelect.id = 'attributeSelect';
    chartContainer2.appendChild(attributeSelect);

    const yearOption = document.createElement('option');
    yearOption.value = 'Year';
    yearOption.text = 'Year';
    attributeSelect.appendChild(yearOption);

    const valueOption = document.createElement('option');
    valueOption.value = 'Value';
    valueOption.text = 'Value';
    attributeSelect.appendChild(valueOption);

    const sctpChartCanvas = document.createElement('canvas');
    sctpChartCanvas.id = 'sctpChart';
    sctpChartCanvas.style.display = 'none';
    chartContainer2.appendChild(sctpChartCanvas);

    const scadChartCanvas = document.createElement('canvas');
    scadChartCanvas.id = 'scadChart';
    scadChartCanvas.style.display = 'none';
    chartContainer2.appendChild(scadChartCanvas);

    const scaovChartCanvas = document.createElement('canvas');
    scaovChartCanvas.id = 'scaovChart';
    scaovChartCanvas.style.display = 'none';
    chartContainer2.appendChild(scaovChartCanvas);

    let sctpChart, scadChart, scaovChart;

    chartSelect.addEventListener('change', function() {
        updateChart();
    });

    sortSelect.addEventListener('change', function() {
        updateChart();
    });

    attributeSelect.addEventListener('change', function() {
        updateChart();
    });

    function updateChart() {
        const selectedValue = chartSelect.value;
        const sortMethod = sortSelect.value;
        const sortAttribute = attributeSelect.value;

        sctpChartCanvas.style.display = 'none';
        scadChartCanvas.style.display = 'none';
        scaovChartCanvas.style.display = 'none';

        if (selectedValue === 'sctpChart') {
            sctpChartCanvas.style.display = 'block';
            fetch('scy.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load file');
                    }
                    return response.json();
                })
                .then(data => {
                    data = sortData(data, sortMethod, sortAttribute, 'Total_Profit');
                    const ctx = sctpChartCanvas.getContext('2d');
                    const subCategories = [...new Set(data.map(item => item.Sub_Category))];
                    const years = [...new Set(data.map(item => item.Year))];
                    const colors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(75, 192, 192)', 'rgb(255, 205, 86)'];
                    const datasets = subCategories.map((subCategory, index) => {
                        const subCategoryData = data.filter(item => item.Sub_Category === subCategory);
                        return {
                            label: `Total Profit (${subCategory})`,
                            data: subCategoryData.map(item => item.Total_Profit),
                            borderWidth: 3,
                            borderColor: colors[index % colors.length],
                            backgroundColor: colors[index % colors.length]
                        };
                    });

                    if (sctpChart) {
                        sctpChart.destroy();
                    }

                    sctpChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: years,
                            datasets: datasets
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Total Profit'
                                    }
                                }
                            }
                        }
                    });
                })
                .catch(error => {
                    console.error('Error loading the data:', error);
                });
        } else if (selectedValue === 'scadChart') {
            scadChartCanvas.style.display = 'block';
            fetch('scy.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load file');
                    }
                    return response.json();
                })
                .then(data => {
                    data = sortData(data, sortMethod, sortAttribute, 'Average_Discount');
                    const ctx = scadChartCanvas.getContext('2d');
                    const subCategories = [...new Set(data.map(item => item.Sub_Category))];
                    const years = [...new Set(data.map(item => item.Year))];
                    const colors = ['rgb(255, 99,                    132)', 'rgb(54, 162, 235)', 'rgb(75, 192, 192)', 'rgb(255, 205, 86)'];
                    const datasets = subCategories.map((subCategory, index) => {
                        const subCategoryData = data.filter(item => item.Sub_Category === subCategory);
                        return {
                            label: `Average Discount (${subCategory})`,
                            data: subCategoryData.map(item => item.Average_Discount * 100),
                            backgroundColor: colors[index % colors.length],
                            borderColor: colors[index % colors.length],
                            borderWidth: 1
                        };
                    });

                    if (scadChart) {
                        scadChart.destroy();
                    }

                    scadChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: years,
                            datasets: datasets
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Average Discount (%)'
                                    }
                                }
                            }
                        }
                    });
                })
                .catch(error => {
                    console.error('Error loading the data:', error);
                });
        } else if (selectedValue === 'scaovChart') {
            scaovChartCanvas.style.display = 'block';
            fetch('scy.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load file');
                    }
                    return response.json();
                })
                .then(data => {
                    data = sortData(data, sortMethod, sortAttribute, 'Average_Order_Value');
                    const ctx = scaovChartCanvas.getContext('2d');
                    const subCategories = [...new Set(data.map(item => item.Sub_Category))];
                    const years = [...new Set(data.map(item => item.Year))];
                    const colors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(75, 192, 192)', 'rgb(255, 205, 86)'];
                    const datasets = subCategories.map((subCategory, index) => {
                        const subCategoryData = data.filter(item => item.Sub_Category === subCategory);
                        return {
                            label: `Average Order Value (${subCategory})`,
                            data: subCategoryData.map(item => item.Average_Order_Value),
                            borderWidth: 3,
                            borderColor: colors[index % colors.length],
                            backgroundColor: colors[index % colors.length]
                        };
                    });

                    if (scaovChart) {
                        scaovChart.destroy();
                    }

                    scaovChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: years,
                            datasets: datasets
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Average Order Value'
                                    }
                                }
                            }
                        }
                    });
                })
                .catch(error => {
                    console.error('Error loading the data:', error);
                });
        }
    }

    updateChart();
});

document.addEventListener('DOMContentLoaded', function() {
    const chartContainer3 = document.getElementById('chartContainer3');

    const chartSelect = document.createElement('select');
    chartSelect.id = 'chartSelect';
    chartContainer3.appendChild(chartSelect);

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Select a chart';
    chartSelect.appendChild(defaultOption);

    const rptdOption = document.createElement('option');
    rptdOption.value = 'rptdChart';
    rptdOption.text = 'Region Percentage Transaction Discount Chart';
    chartSelect.appendChild(rptdOption);

    const rtpOption = document.createElement('option');
    rtpOption.value = 'rtpChart';
    rtpOption.text = 'Region Total Profit Chart';
    chartSelect.appendChild(rtpOption);

    const raovOption = document.createElement('option');
    raovOption.value = 'raovChart';
    raovOption.text = 'Region Average Order Value Chart';
    chartSelect.appendChild(raovOption);

    const sortSelect = document.createElement('select');
    sortSelect.id = 'sortSelect';
    chartContainer3.appendChild(sortSelect);

    const ascOption = document.createElement('option');
    ascOption.value = 'asc';
    ascOption.text = 'Ascending';
    sortSelect.appendChild(ascOption);

    const descOption = document.createElement('option');
    descOption.value = 'desc';
    descOption.text = 'Descending';
    sortSelect.appendChild(descOption);

    const attributeSelect = document.createElement('select');
    attributeSelect.id = 'attributeSelect';
    chartContainer3.appendChild(attributeSelect);

    const yearOption = document.createElement('option');
    yearOption.value = 'Year';
    yearOption.text = 'Year';
    attributeSelect.appendChild(yearOption);

    const valueOption = document.createElement('option');
    valueOption.value = 'Value';
    valueOption.text = 'Value';
    attributeSelect.appendChild(valueOption);

    const rptdChartCanvas = document.createElement('canvas');
    rptdChartCanvas.id = 'rptdChart';
    rptdChartCanvas.style.display = 'none';
    chartContainer3.appendChild(rptdChartCanvas);

    const rtpChartCanvas = document.createElement('canvas');
    rtpChartCanvas.id = 'rtpChart';
    rtpChartCanvas.style.display = 'none';
    chartContainer3.appendChild(rtpChartCanvas);

    const raovChartCanvas = document.createElement('canvas');
    raovChartCanvas.id = 'raovChart';
    raovChartCanvas.style.display = 'none';
    chartContainer3.appendChild(raovChartCanvas);

    let rptdChart, rtpChart, raovChart;

    chartSelect.addEventListener('change', function() {
        updateChart();
    });

    sortSelect.addEventListener('change', function() {
        updateChart();
    });

    attributeSelect.addEventListener('change', function() {
        updateChart();
    });

    function updateChart() {
        const selectedValue = chartSelect.value;
        const sortMethod = sortSelect.value;
        const sortAttribute = attributeSelect.value;

        rptdChartCanvas.style.display = 'none';
        rtpChartCanvas.style.display = 'none';
        raovChartCanvas.style.display = 'none';

        if (selectedValue === 'rptdChart') {
            rptdChartCanvas.style.display = 'block';
            fetch('ry.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load file');
                    }
                    return response.json();
                })
                .then(data => {
                    data = sortData(data, sortMethod, sortAttribute, 'Persen_Transaksi_Diskon');
                    const ctx = rptdChartCanvas.getContext('2d');
                    const regions = [...new Set(data.map(item => item.Region))];
                    const years = [...new Set(data.map(item => item.Year))];
                    const colors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(75, 192, 192)', 'rgb(255, 205, 86)'];
                    const datasets = regions.map((region, index) => {
                        const regionData = data.filter(item => item.Region === region);
                        return {
                            label: `Persen Transaksi Diskon (${region})`,
                            data: regionData.map(item => item.Persen_Transaksi_Diskon * 100),
                            backgroundColor: colors[index % colors.length],
                            borderColor: colors[index % colors.length],
                            borderWidth: 1
                        };
                    });

                    if (rptdChart) {
                        rptdChart.destroy();
                    }

                    rptdChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: years,
                            datasets: datasets
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text:  'Persen Transaksi Diskon (%)'
                                    }
                                }
                            }
                        }
                    });
                })
                .catch(error => {
                    console.error('Error loading the data:', error);
                });
        } else if (selectedValue === 'rtpChart') {
            rtpChartCanvas.style.display = 'block';
            fetch('ry.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load file');
                    }
                    return response.json();
                })
                .then(data => {
                    data = sortData(data, sortMethod, sortAttribute, 'Total_Profit');
                    const ctx = rtpChartCanvas.getContext('2d');
                    const regions = [...new Set(data.map(item => item.Region))];
                    const years = [...new Set(data.map(item => item.Year))];
                    const colors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(75, 192, 192)', 'rgb(255, 205, 86)'];
                    const datasets = regions.map((region, index) => {
                        const regionData = data.filter(item => item.Region === region);
                        return {
                            label: `Total Profit (${region})`,
                            data: regionData.map(item => item.Total_Profit),
                            borderWidth: 3,
                            borderColor: colors[index % colors.length],
                            backgroundColor: colors[index % colors.length]
                        };
                    });

                    if (rtpChart) {
                        rtpChart.destroy();
                    }

                    rtpChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: years,
                            datasets: datasets
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Total Profit'
                                    }
                                }
                            }
                        }
                    });
                })
                .catch(error => {
                    console.error('Error loading the data:', error);
                });
        } else if (selectedValue === 'raovChart') {
            raovChartCanvas.style.display = 'block';
            fetch('ry.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load file');
                    }
                    return response.json();
                })
                .then(data => {
                    data = sortData(data, sortMethod, sortAttribute, 'Average_Order_Value');
                    const ctx = raovChartCanvas.getContext('2d');
                    const regions = [...new Set(data.map(item => item.Region))];
                    const years = [...new Set(data.map(item => item.Year))];
                    const colors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(75, 192, 192)', 'rgb(255, 205, 86)'];
                    const datasets = regions.map((region, index) => {
                        const regionData = data.filter(item => item.Region === region);
                        return {
                            label: `Average Order Value (${region})`,
                            data: regionData.map(item => item.Average_Order_Value),
                            borderWidth: 3,
                            borderColor: colors[index % colors.length],
                            backgroundColor: colors[index % colors.length]
                        };
                    });

                    if (raovChart) {
                        raovChart.destroy();
                    }

                    raovChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: years,
                            datasets: datasets
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Average Order Value'
                                    }
                                }
                            }
                        }
                    });
                })
                .catch(error => {
                    console.error('Error loading the data:', error);
                });
        }
    }

    updateChart();
});

document.addEventListener('DOMContentLoaded', function() {
    const chartContainer4 = document.getElementById('chartContainer4');

    const chartSelect = document.createElement('select');
    chartSelect.id = 'chartSelect4';
    chartContainer4.appendChild(chartSelect);

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Select a chart';
    chartSelect.appendChild(defaultOption);

    const smtqOption = document.createElement('option');
    smtqOption.value = 'smtqChart';
    smtqOption.text = 'Total Quantity Chart';
    chartSelect.appendChild(smtqOption);

    const smtpOption = document.createElement('option');
    smtpOption.value = 'smtpChart';
    smtpOption.text = 'Total Profit Chart';
    chartSelect.appendChild(smtpOption);

    const smabsOption = document.createElement('option');
    smabsOption.value = 'smabsChart';
    smabsOption.text = 'ABS Chart';
    chartSelect.appendChild(smabsOption);

    const smaovOption = document.createElement('option');
    smaovOption.value = 'smaovChart';
    smaovOption.text = 'Average Order Value Chart';
    chartSelect.appendChild(smaovOption);

    const sortSelect = document.createElement('select');
    sortSelect.id = 'sortSelect4';
    chartContainer4.appendChild(sortSelect);

    const ascOption = document.createElement('option');
    ascOption.value = 'asc';
    ascOption.text = 'Ascending';
    sortSelect.appendChild(ascOption);

    const descOption = document.createElement('option');
    descOption.value = 'desc';
    descOption.text = 'Descending';
    sortSelect.appendChild(descOption);

    const attributeSelect = document.createElement('select');
    attributeSelect.id = 'attributeSelect4';
    chartContainer4.appendChild(attributeSelect);

    const yearOption = document.createElement('option');
    yearOption.value = 'Year';
    yearOption.text = 'Year';
    attributeSelect.appendChild(yearOption);

    const valueOption = document.createElement('option');
    valueOption.value = 'Value';
    valueOption.text = 'Value';
    attributeSelect.appendChild(valueOption);

    const smtqChartCanvas = document.createElement('canvas');
    smtqChartCanvas.id = 'smtqChart4';
    smtqChartCanvas.style.display = 'none';
    chartContainer4.appendChild(smtqChartCanvas);

    const smtpChartCanvas = document.createElement('canvas');
    smtpChartCanvas.id = 'smtpChart4';
    smtpChartCanvas.style.display = 'none';
    chartContainer4.appendChild(smtpChartCanvas);

    const smabsChartCanvas = document.createElement('canvas');
    smabsChartCanvas.id = 'smabsChart4';
    smabsChartCanvas.style.display = 'none';
    chartContainer4.appendChild(smabsChartCanvas);

    const smaovChartCanvas = document.createElement('canvas');
    smaovChartCanvas.id = 'smaovChart4';
    smaovChartCanvas.style.display = 'none';
    chartContainer4.appendChild(smaovChartCanvas);

    let smtqChart, smtpChart, smabsChart, smaovChart;

    chartSelect.addEventListener('change', function() {
        updateChart();
    });

    sortSelect.addEventListener('change', function() {
        updateChart();
    });

    attributeSelect.addEventListener('change', function() {
        updateChart();
    });

    function updateChart() {
        const selectedValue = chartSelect.value;
        const sortMethod = sortSelect.value;
        const sortAttribute = attributeSelect.value;

        smtqChartCanvas.style.display = 'none';
        smtpChartCanvas.style.display = 'none';
        smabsChartCanvas.style.display = 'none';
        smaovChartCanvas.style.display = 'none';

        if (selectedValue === 'smtqChart') {
            smtqChartCanvas.style.display = 'block';
            fetch('smy.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load file');
                    }
                    return response.json();
                })
                .then(data => {
                    data = sortData(data, sortMethod, sortAttribute, 'Total_Quantity');
                    const ctx = smtqChartCanvas.getContext('2d');
                    const shipModes = [...new Set(data.map(item => item.Ship_mode))];
                    const years = [...new Set(data.map(item => item.Year))];
                    const colors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(75, 192, 192)', 'rgb(255, 205, 86)'];
                    const datasets = shipModes.map((shipMode, index) => {
                        const shipModeData = data.filter(item => item.Ship_mode === shipMode);
                        return {
                            label: `Total Quantity (${shipMode})`,
                            data: shipModeData.map(item => item.Total_Quantity),
                            backgroundColor: colors[index % colors.length],
                            borderColor: colors[index % colors.length],
                            borderWidth: 1
                        };
                    });

                    if (smtqChart) {
                        smtqChart.destroy();
                    }

                    smtqChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: years,
                            datasets: datasets
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Total Quantity'
                                    }
                                }
                            }
                        }
                    });
                })
                .catch(error => {
                    console.error('Error loading the data:', error);
                });
        } else if (selectedValue === 'smtpChart') {
            smtpChartCanvas.style.display = 'block';
            fetch('smy.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load file');
                    }
                    return response.json();
                })
                .then(data => {
                    data = sortData(data, sortMethod, sortAttribute, 'Total_Profit');
                    const ctx = smtpChartCanvas.getContext('2d');
                    const shipModes = [...new Set(data.map(item => item.Ship_mode))];
                    const years = [...new Set(data.map(item => item.Year))];
                    const colors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(75, 192, 192)', 'rgb(255, 205, 86)'];
                    const datasets = shipModes.map((shipMode, index) => {
                        const shipModeData = data.filter(item => item.Ship_mode === shipMode);
                        return {
                            label: `Total Profit (${shipMode})`,
                            data: shipModeData.map(item => item.Total_Profit),
                            borderWidth: 3,
                            borderColor: colors[index % colors.length],
                            backgroundColor: colors[index % colors.length]
                        };
                    });

                    if (smtpChart) {
                        smtpChart.destroy();
                    }

                    smtpChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: years,
                            datasets: datasets
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Total Profit'
                                    }
                                }
                            }
                        }
                    });
                })
                .catch(error => {
                    console.error('Error loading the data:', error);
                });
        } else if (selectedValue === 'smabsChart') {
            smabsChartCanvas.style.display = 'block';
            fetch('smy.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load file');
                    }
                    return response.json();
                })
                .then(data => {
                    data = sortData(data, sortMethod, sortAttribute, 'ABS');
                    const ctx = smabsChartCanvas.getContext('2d');
                    const shipModes = [...new Set(data.map(item => item.Ship_mode))];
                    const years = [...new Set(data.map(item => item.Year))];
                    const colors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(75, 192, 192)', 'rgb(255, 205, 86)'];
                    const datasets = shipModes.map((shipMode, index) => {
                        const shipModeData = data.filter(item => item.Ship_mode === shipMode);
                        return {
                            label: `ABS (${shipMode})`,
                            data: shipModeData.map(item => item.ABS),
                            backgroundColor: colors[index % colors.length],
                            borderColor: colors[index % colors.length],
                            borderWidth: 1
                        };
                    });

                    if (smabsChart) {
                        smabsChart.destroy();
                    }

                    smabsChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: years,
                            datasets: datasets
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'ABS'
                                    }
                                }
                            }
                        }
                    });
                })
                .catch(error => {
                    console.error('Error loading the data:', error);
                });
        } else if (selectedValue === 'smaovChart') {
            smaovChartCanvas.style.display = 'block';
            fetch('smy.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load file');
                    }
                    return response.json();
                })
                .then(data => {
                    data = sortData(data, sortMethod, sortAttribute, 'Average_Order_Value');
                    const ctx = smaovChartCanvas.getContext('2d');
                    const shipModes = [...new Set(data.map(item => item.Ship_mode))];
                    const years = [...new Set(data.map(item => item.Year))];
                    const colors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(75, 192, 192)', 'rgb(255, 205, 86)'];
                    const datasets = shipModes.map((shipMode, index) => {
                        const shipModeData = data.filter(item => item.Ship_mode === shipMode);
                        return {
                            label: `Average Order Value (${shipMode})`,
                            data: shipModeData.map(item => item.Average_Order_Value),
                            borderWidth: 3,
                            borderColor: colors[index % colors.length],
                            backgroundColor: colors[index % colors.length]
                        };
                    });

                    if (smaovChart) {
                        smaovChart.destroy();
                    }

                    smaovChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: years,
                            datasets: datasets
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Average Order Value'
                                    }
                                }
                            }
                        }
                    });
                })
                .catch(error => {
                    console.error('Error loading the data:', error);
                });
        }
    }

    updateChart();
});

document.addEventListener('DOMContentLoaded', function() {
    fetch('pfq2017.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load file');
            }
            return response.json();
        })
        .then(data => {
            const quarters = data.map(item => item.Quarter);
            const totalSales = data.map(item => item.Total_Sales);
            const totalProfit = data.map(item => item.Total_Profit);
            const totalTransaction = data.map(item => item.Total_Transaction);
            const totalCustomers = data.map(item => item.Total_Customers);
            const pfqtptsCtx = document.getElementById('pfqtptsChart').getContext('2d');
            const pfqtptsChart = new Chart(pfqtptsCtx, {
                type: 'line',
                data: {
                    labels: quarters,
                    datasets: [
                        {
                            label: 'Total Profit',
                            data: totalProfit,
                            yAxisID: 'profit',
                            borderWidth: 3,
                            fill: false,
                            borderColor: 'rgb(255, 99, 132)'
                        },
                        {
                            label: 'Total Sales',
                            data: totalSales,
                            yAxisID: 'sales',
                            borderWidth: 3,
                            fill: false,
                            borderColor: 'rgb(54, 162, 235)'
                        }
                    ]
                },
                options: {
                    scales: {
                        profit: {
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Total Profit'
                            }
                        },
                        sales: {
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Total Sales'
                            }
                        }
                    }
                }
            });

            const pfqtttcCtx = document.getElementById('pfqtttcChart').getContext('2d');
            const pfqtttcChart = new Chart(pfqtttcCtx, {
                type: 'line',
                data: {
                    labels: quarters,
                    datasets: [
                        {
                            label: 'Total Transaction',
                            data: totalTransaction,
                            yAxisID: 'transaction',
                            borderWidth: 3,
                            fill: false,
                            borderColor: 'rgb(255, 99, 132)' 
                        },
                        {
                            label: 'Total Customer',
                            data: totalCustomers,
                            yAxisID: 'customer',
                            borderWidth: 3,
                            fill: false,
                            borderColor: 'rgb(54, 162, 235)' 
                        }
                    ]
                },
                options: {
                    scales: {
                        transaction: {
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Total Transaction'
                            }
                        },
                        customer: {
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Total Customer'
                            },
                            grid: {
                                drawOnChartArea: false
                            }
                        }
                    }
                }
            });

            // Function to update charts based on selected quarters
            function updateCharts(selectedQuarters) {
                // Filter data based on selected quarters
                const filteredData = data.filter(item => selectedQuarters.includes(item.Quarter));

                // Update line chart
                pfqtptsChart.data.labels = filteredData.map(item => item.Quarter);
                pfqtptsChart.data.datasets[0].data = filteredData.map(item => item.Total_Profit);
                pfqtptsChart.data.datasets[1].data = filteredData.map(item => item.Total_Sales);
                pfqtptsChart.update();

                // Update line chart
                pfqtttcChart.data.labels = filteredData.map(item => item.Quarter);
                pfqtttcChart.data.datasets[0].data = filteredData.map(item => item.Total_Transaction);
                pfqtttcChart.data.datasets[1].data = filteredData.map(item => item.Total_Customers);
                pfqtttcChart.update();
            }

            // Create checklist buttons for quarters
            const quartersContainer = document.getElementById('quartersChecklist');
            quarters.forEach(quarter => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = quarter;
                checkbox.checked = true; // By default, all quarters are checked
                checkbox.addEventListener('change', function() {
                    const selectedQuarters = Array.from(quartersContainer.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
                    updateCharts(selectedQuarters);
                });

                const label = document.createElement('label');
                label.textContent = quarter;
                label.appendChild(checkbox);

                quartersContainer.appendChild(label);
            });
        })
        .catch(error => {
            console.error('Error loading the data:', error);
        });

    fetch('scq2017.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load file');
            }
            return response.json();
        })
        .then(scqData => {
            const subCategories = [...new Set(scqData.map(item => item.Sub_Category))];
            const averageDiscounts = subCategories.map(subCategory => {
                const subCategoryData = scqData.filter(item => item.Sub_Category === subCategory);
                const totalAverageDiscount = subCategoryData.reduce((acc, curr) => acc + curr.Average_Discount, 0) * 100;
                return totalAverageDiscount;
            });

            const scqCtx = document.getElementById('scq2017Chart').getContext('2d');
            new Chart(scqCtx, {
                type: 'bar',
                data: {
                    labels: subCategories,
                    datasets: [
                        {
                            label: 'Total Average Discount',
                            data: averageDiscounts,
                            backgroundColor: 'rgb(54, 162, 235)' 
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Total Average Discount (%)'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error loading the data:', error);
        });

    fetch('sq2017.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load file');
            }
            return response.json();
        })
        .then(sqData => {
            const segments = [...new Set(sqData.map(item => item.Segment))];
            const totalAverageOrders = segments.map(segment => {
                const segmentData = sqData.filter(item => item.Segment === segment);
                const totalAverageOrderValue = segmentData.reduce((acc, curr) => acc + curr.Average_Order_Value, 0);
                return totalAverageOrderValue;
            });

            const sqCtx = document.getElementById('sq2017Chart').getContext('2d');
            new Chart(sqCtx, {
                type: 'pie',
                data: {
                    labels: segments,
                    datasets: [{
                        label: 'Total Average Order Value',
                        data: totalAverageOrders,
                        backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'], 
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero:true,
                            title: {
                                display: true,
                                text: 'Total Average Order Value'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error loading the data:', error);
        });
});

fetch('Performance2017.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        $('#performanceTable').DataTable({
            data: data,
            columns: [
                { data: 'Order ID' },
                { data: 'Order Date' },
                { data: 'Ship Date' },
                { data: 'Ship Mode' },
                { data: 'Customer ID' },
                { data: 'Segment' },
                { data: 'Region' },
                { data: 'Sub-Category' },
                { data: 'Sales' },
                { data: 'Quantity' },
                { data: 'Discount' },
                { data: 'Profit' }
            ]
        });
    })
    .catch(error => console.error('Error loading the data:', error));

