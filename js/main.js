// 主JavaScript文件
document.addEventListener('DOMContentLoaded', function() {
    // 导航切换功能
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            
            // 更新活动按钮
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 显示目标内容区
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            
            document.getElementById(targetId).classList.add('active');
            
            if (targetId === 'composite-map') {
                setupIframeAutoResize('composite-map-frame');
            } else if (targetId === 'region-chart') {
                setupIframeAutoResize('region-chart-frame');
            } else if (targetId === 'density-chart') {
                setupIframeAutoResize('density-chart-frame');
            }
        });
    });
    
    // 查看完整图表按钮
    const viewButtons = document.querySelectorAll('.view-full-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            
            // 切换导航
            navButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector(`.nav-btn[data-target="${targetId}"]`).classList.add('active');
            
            // 显示目标内容区
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            
            document.getElementById(targetId).classList.add('active');
        });
    });
    
    // 全屏功能
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    fullscreenBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const elem = document.documentElement;
        
        if (!document.fullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
            this.innerHTML = '<i class="fas fa-compress"></i> 退出全屏';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            this.innerHTML = '<i class="fas fa-expand"></i> 全屏';
        }
    });
    
    // 重置视图功能
    const resetViewBtn = document.getElementById('reset-view-btn');
    resetViewBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 重置到仪表盘视图
        navButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('.nav-btn[data-target="dashboard"]').classList.add('active');
        
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        document.getElementById('dashboard').classList.add('active');
    });
    
    // 调整iframe大小函数
    function resizeIframe(iframeId) {
        const iframe = document.getElementById(iframeId);
        if (iframe) {
            const contentHeight = iframe.contentWindow.document.body.scrollHeight || 
            iframe.contentWindow.document.documentElement.scrollHeight;
            iframe.style.height = (iframe.contentWindow.document.body.scrollHeight + 50) + 'px';
            iframe.style.maxHeight = "90vh"; 
        }
    }
    function setupIframeAutoResize(iframeId) {
        const iframe = document.getElementById(iframeId);
        if (!iframe) return;
        
        // 1. 移除旧的load事件（避免重复触发）
        iframe.onload = null;
        
        // 2. 新的load事件：内容加载完成后调整高度（ECharts渲染完成）
        iframe.onload = function() {
            // 首次调整（加载完成）
            resizeIframe(iframeId);
            // 二次确认（兼容ECharts渲染延迟，300ms足够图表渲染完成）
            setTimeout(() => resizeIframe(iframeId), 300);
        };
        
        // 3. 立即触发一次（处理iframe已缓存/提前加载的情况）
        resizeIframe(iframeId);
    }
    
    // 为仪表盘创建预览图表
    createDashboardCharts();
    
    // 监听窗口大小变化
    window.addEventListener('resize', function() {
        // 重新调整活动iframe的大小
        const activeSection = document.querySelector('.content-section.active');
        if (activeSection.id === 'composite-map') {
            resizeIframe('composite-map-frame');
        } else if (activeSection.id === 'region-chart') {
            resizeIframe('region-chart-frame');
        } else if (activeSection.id === 'density-chart') {
            resizeIframe('density-chart-frame');
        }
    });
});

// 创建仪表盘预览图表
function createDashboardCharts() {
    // 如果没有ECharts，则不执行
    if (typeof echarts === 'undefined') return;
    
    // 创建地图预览
    const mapPreview = echarts.init(document.getElementById('dashboard-map'));
    const mapOption = {
        title: {
            text: '人口密度分布',
            left: 'center',
            top: 10,
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}人/平方公里'
        },
        visualMap: {
            min: 0,
            max: 1000,
            left: 'left',
            top: 'bottom',
            text: ['高', '低'],
            calculable: true,
            inRange: {
                color: ['#0099FF', '#33CC33', '#FFFF00', '#FF9900', '#FF3333']
            },
            textStyle: {
                color: '#333',
                fontSize: 10
            }
        },
        series: [{
            name: '人口密度',
            type: 'map',
            map: 'china',
            roam: false,
            zoom: 1.2,
            label: {
                show: false
            },
            data: [
                { name: '北京', value: 1332.32 },
                { name: '天津', value: 1144.58},
                { name: '河北', value: 392.11},
                { name: '山西', value: 221.19},
                { name: '内蒙古', value: 20.92},
                { name: '辽宁', value: 281.85},
                { name: '吉林', value: 122.35},
                { name: '黑龙江', value: 67.66},
                { name: '上海', value: 2975.83},
                { name: '江苏', value: 799.81},
                { name: '浙江', value: 628.12},
                { name: '安徽', value: 436.78},
                { name: '福建', value: 337.47},
                { name: '江西', value: 270.46},
                { name: '山东', value: 641.10},
                { name: '河南', value: 592.46},
                { name: '湖北', value: 313.98},
                { name: '湖南', value: 310.05},
                { name: '广东', value: 707.24},
                { name: '广西', value: 211.57},
                { name: '海南', value: 296.56},
                { name: '重庆', value: 387.43},
                { name: '四川', value: 172.14},
                { name: '贵州', value: 219.48},
                { name: '云南', value: 121.95},
                { name: '西藏', value: 3.04},
                { name: '陕西', value: 192.20},
                { name: '甘肃', value: 57.89},
                { name: '青海', value: 8.53},
                { name: '宁夏', value: 140.48 },
                { name: '新疆', value: 15.92},
                { name: '香港', value: 6730.79},
                { name: '澳门', value: 20718.18},
                { name: '台湾', value: 647.03}
            ],
            itemStyle: {
                borderColor: '#fff',
                borderWidth: 0.5
            },
            emphasis: {
                itemStyle: {
                    areaColor: '#ffcc00'
                }
            }
        }]
    };
    mapPreview.setOption(mapOption);
    
    // 创建饼图预览
    const piePreview = echarts.init(document.getElementById('dashboard-pie'));
    const pieOption = {
        title: {
            text: '六大区域',
            left: 'center',
            top: 10,
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}'
        },
        legend: {
            show: false
        },
        series: [{
            name: '区域人均GDP',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '55%'],
            data: [
                { name: '华东', value: 118000 },
                { name: '华南', value: 95000 },
                { name: '华北', value: 105000 },
                { name: '东北', value: 63000 },
                { name: '华中', value: 72000 },
                { name: '西部', value: 68000 }
            ],
            itemStyle: {
                borderRadius: 6,
                borderColor: '#fff',
                borderWidth: 2
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            label: {
                show: false
            }
        }]
    };
    piePreview.setOption(pieOption);
    
    // 创建条形图预览
    const barPreview = echarts.init(document.getElementById('dashboard-bar'));
    const barOption = {
        title: {
            text: 'Top5省份',
            left: 'center',
            top: 10,
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: '{b}: {c}人/平方公里'
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%',
            top: '30%'
        },
        xAxis: {
            type: 'category',
            data: ['澳门', '香港', '上海', '北京', '天津'],
            axisLabel: {
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            name: '人/平方公里',
            nameTextStyle: {
                fontSize: 10
            },
            axisLabel: {
                fontSize: 10
            }
        },
        series: [{
            name: '人口密度',
            type: 'bar',
            data: [20718, 6730, 2975, 1332, 1144],
            itemStyle: {
                color: function(params) {
                    var colorList = ['#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da'];
                    return colorList[params.dataIndex];
                },
                borderRadius: [4, 4, 0, 0]
            },
            label: {
                show: true,
                position: 'top',
                fontSize: 10
            }
        }]
    };
    barPreview.setOption(barOption);
    
    // 窗口大小变化时调整预览图表
    window.addEventListener('resize', function() {
        mapPreview.resize();
        piePreview.resize();
        barPreview.resize();
    });
}