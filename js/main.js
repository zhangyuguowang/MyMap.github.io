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
                { name: '北京', value: 1332.8, gdp: 200205, center: [116.46, 39.92] },
                { name: '天津', value: 1146.1, gdp: 122707, center: [117.2, 39.13] },
                { name: '河北', value: 391.6, gdp: 59440, center: [114.48, 38.03] },
                { name: '山西', value: 221.2, gdp: 74144, center: [112.53, 37.87] },
                { name: '内蒙古', value: 20.3, gdp: 102784, center: [111.65, 40.82] },
                { name: '辽宁', value: 282.6, gdp: 72237, center: [123.43, 41.8] },
                { name: '吉林', value: 124.8, gdp: 57840, center: [125.35, 43.88] },
                { name: '黑龙江', value: 64.7, gdp: 51874, center: [126.63, 45.75] },
                { name: '上海', value: 3553.6, gdp: 189824, center: [121.48, 31.22] },
                { name: '江苏', value: 831, gdp: 150390, center: [118.78, 32.04] },
                { name: '浙江', value: 651, gdp: 124571, center: [120.19, 30.26] },
                { name: '安徽', value: 437.2, gdp: 76868, center: [117.27, 31.86] },
                { name: '福建', value: 337.3, gdp: 129943, center: [119.3, 26.08] },
                { name: '江西', value: 270.5, gdp: 71318, center: [115.85, 28.68] },
                { name: '山东', value: 644.4, gdp: 90951, center: [117.0, 36.65] },
                { name: '河南', value: 587.7, gdp: 60247, center: [113.65, 34.76] },
                { name: '湖北', value: 314, gdp: 95587, center: [114.31, 30.52] },
                { name: '湖南', value: 310.1, gdp: 76146, center: [113.0, 28.21] },
                { name: '广东', value: 706.7, gdp: 106779, center: [113.23, 23.16] },
                { name: '广西', value: 212.4, gdp: 54113, center: [108.33, 22.84] },
                { name: '海南', value: 294.7, gdp: 72384, center: [110.35, 20.02] },
                { name: '重庆', value: 387.3, gdp: 94459, center: [106.55, 29.57] },
                { name: '四川', value: 172.2, gdp: 71861, center: [104.06, 30.67] },
                { name: '贵州', value: 219.6, gdp: 54109, center: [106.71, 26.57] },
                { name: '云南', value: 119.8, gdp: 64244, center: [102.73, 25.04] },
                { name: '西藏', value: 3, gdp: 65553, center: [91.11, 29.97] },
                { name: '陕西', value: 191.9, gdp: 85491, center: [108.95, 34.27] },
                { name: '甘肃', value: 54.3, gdp: 48120, center: [103.73, 36.03] },
                { name: '青海', value: 0.8, gdp: 63959, center: [101.74, 36.56] },
                { name: '宁夏', value: 11, gdp: 72908, center: [106.27, 38.47] },
                { name: '新疆', value: 1.6, gdp: 73618, center: [87.68, 43.77] },
                { name: '香港', value: 6760, gdp: 355255, center: [114.17, 22.28] },
                { name: '澳门', value: 20576, gdp: 451183, center: [113.55, 22.19] },
                { name: '台湾', value: 647, gdp: 231285, center: [121.5, 25.03] }
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
                { name: '华北', value: 382352/3 },
                { name: '华东', value: 824520/7 },
                { name: '华南', value: 233276/3 },
                { name: '华中', value: 231980/3 },
                { name: '西部', value: 694322/10 },
                { name: '东北', value: 181951/3 }
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
            data: [20576, 6760, 3557, 1333, 1146],
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