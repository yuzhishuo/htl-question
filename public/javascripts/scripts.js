(function ($) {
    "use strict"; // Start of use strict

    //#region “结果” 标签关闭现实直到提交后 
    const resultAnchor = document.getElementById("result_anchor");
    resultAnchor.setAttribute("herf", "javascript:return false;");
    resultAnchor.style.cursor = "default";
    resultAnchor.style.opacity = "0.2";

    const resultView = document.getElementById('result');
    const rawDisplayResult = resultView.style.display;
    resultView.style.display = "none";
    //#endregion

    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
        if (
            location.pathname.replace(/^\//, "") ==
            this.pathname.replace(/^\//, "") &&
            location.hostname == this.hostname
        ) {
            var target = $(this.hash);
            target = target.length ?
                target :
                $("[name=" + this.hash.slice(1) + "]");
            if (target.length) {
                $("html, body").animate({
                    scrollTop: target.offset().top,
                },
                    1000,
                    "easeInOutExpo"
                );
                return false;
            }
        }
    });

    // Closes responsive menu when a scroll trigger link is clicked
    $(".js-scroll-trigger").click(function () {
        $(".navbar-collapse").collapse("hide");
    });

    const fromElement = document.getElementById("big5personquestion")
    const QuestionNumber = fromElement.length / 5 /* 定长选项数目 */;
    const QuestionNumberSelected = []; /* placement  */

    for (let index = 0; index < QuestionNumber; index++) {
        QuestionNumberSelected.push(0);
    }

    let isFull = true;
    let fisrtFullQuestion = 0;
    let clicked = false;
    // 提交表单事件
    $('#summit').click(() => {


        //#region  check all input
        for (let index = 0; index < QuestionNumber; index++) {
            for (let inputIndex = 0; inputIndex < 5; inputIndex++) {
                if (fromElement[index * 5 + inputIndex].checked) {
                    QuestionNumberSelected[index] = inputIndex + 1 /* index = value */;
                    break;
                }
                if (inputIndex == 4 && QuestionNumberSelected[index] === 0) {
                    isFull = false;
                    fisrtFullQuestion = index + 1;
                }
            }

            if (!isFull) break;
        }

        if (clicked) {
            alert("请勿重复提交");
            location.replace(location.href);
            return;
        }
        clicked = true;
        //#endregion

        //#region  exist unfinished answer
        if (!isFull) {
            alert("仍有题目未答，请从第" + fisrtFullQuestion + "题开始");
            // re-raw
            fisrtFullQuestion = 0;
            isFull = true;
            return;
        }
        //#endregion

        //#region 五种情绪得分计算
        let neu = 0; //神经
        let ope = 0; // 开放
        let con = 0; // 责任
        let ext = 0; //外倾
        let agr = 0; //宜人

        for (let num = 0; num < QuestionNumberSelected.length; num++) {
            // 神经
            const neu_set = Object.freeze([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55])
            if (neu_set.includes(num)) {
                if ([0, 5, 20, 30].includes(num)) {
                    neu += 6 - QuestionNumberSelected[num];

                } else {
                    neu += QuestionNumberSelected[num] - 0;
                }
            }
            // 外倾
            else if ([1, 6, 11, 17, 21, 26, 31, 36, 41, 51, 56].includes(num)) {
                if ([17, 21, 46].includes(num)) {
                    ext += 6 - QuestionNumberSelected[num];
                } else {
                    ext += QuestionNumberSelected[num] - 0;
                }
            }
            // 开放
            else if ([2, 7, 12, 16, 22, 27, 32, 37, 42, 47, 52, 57].includes(num)) {
                if ([2, 12, 27, 42, 52, 57].includes(num)) {
                    ope += 6 - QuestionNumberSelected[num];
                } else {
                    ope += QuestionNumberSelected[num] - 0;
                }
            }
            // 宜人
            else if ([3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53, 58].includes(num)) {
                if ([3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53].includes(num)) {
                    agr += 6 - QuestionNumberSelected[num];
                } else {
                    agr += QuestionNumberSelected[num] - 0;
                }
            }
            // 责任
            else if ([4, 9, 14, 19, 24, 29, 34, 39, 44, 49, 54, 59].includes(num)) {
                if ([19, 29, 59].includes(num)) {
                    con += 6 - QuestionNumberSelected[num];
                } else {
                    con += QuestionNumberSelected[num] - 0;
                }
            }
            // 情绪 （正、负）
            // 正
            let pos_num = 0,
                pos_qul = 0,
                neg_num = 0,
                neg_qul = 0;
            if ([0, 1, 2, 3, 6, 7, 9, 12, 16, 18, 19, 21, 24, 26, 27, 31, 32, 33, 34, 36, 37, 39, 42, 43, 45, 49, 51, 52, 57, 59, 61, 63, 65, 67, 70, 72, 73, 74, 77, 79, 80, 83, 85, 86, 89, 91, 92, 93, 95, 97, 98, 102, 103, 104].includes(num)) {
                pos_num++;
                pos_qul += QuestionNumberSelected[num] - 0;
            }
            // 外倾
            else if ([5, 8, 10, 11, 14, 15, 20, 23, 25, 28, 29, 30, 35, 38, 40, 41, 44, 50, 54, 58, 60, 62, 64, 66, 68, 69, 71, 75, 76, 78, 81, 82, 84, 87, 88, 90, 94, 96, 99, 100, 101].includes(num)) {
                neg_num++;
                neg_qul += QuestionNumberSelected[num] - 0;
            }
        }
        //#endregion

        //#region 
        const fivecom = [(neu), (ext), (ope), (agr), (con)];
        let max_five = 0;
        let max_i = 0;
        let most_per = null;
        let tot = 0;
        let ave = 0;

        for (let j = 0; j < 5; j++) {
            tot += parseInt(fivecom[j]);
            if (max_five < fivecom[j]) {
                max_five = fivecom[j];
                max_i = j;
            }
        }
        ave = parseInt(tot) / 5;
        switch (max_i) {
            case 0:
                most_per = '敏感型'
                break;
            case 1:
                most_per = '外向型'
                break;
            case 2:
                most_per = '开放型'
                break;
            case 3:
                most_per = '宜人型'
                break;
            case 4:
                most_per = '尽责型'
                break;
        }

        const fuwu = QuestionNumberSelected[105] - 0;
        const cehua = QuestionNumberSelected[106] - 0;
        const fenxi = QuestionNumberSelected[107] - 0;
        const guanli = QuestionNumberSelected[108] - 0;
        const yishu = QuestionNumberSelected[109] - 0;
        const keyan = QuestionNumberSelected[110] - 0;
        const wenyu = QuestionNumberSelected[111] - 0;
        const renwen = QuestionNumberSelected[112] - 0;
        const occ = []
        if (ext >= ave && agr >= ave && fuwu >= 3) // range(46,39)
        {
            occ.push("\n服务类:（宠物服务、餐饮、运动健身、销售行政/商务、销售管理、销售技术支持、" +
                "教育培训、旅游服务、汽车销售与服务、运营客服、物流、采购、进出口贸易）\n");
        }
        if (neu >= ave && ope >= ave && yishu >= 3) // range(39,42)
        {
            occ.push("\n艺术类:（视觉设计、用户研究、高端设计职位、其他设计职位、非视觉设计、交互设计、" +
                "房地产规划开发、设计装修与市政建设）\n");
        }
        if (agr >= ave && con >= ave && guanli >= 3) // range(39, 49)
        {
            occ.push("\n管理类:（高级管理、高端产品职位、产品经理、物业管理、高端房地产职位、高端供应链职位、项目管理、教育行政）\n");
        }
        if (ext >= ave && con >= ave && wenyu >= 3) {
            occ.push("\n文娱类:（影视媒体、采编/写作/出版、" +
                "教师、IT培训、职业培训、特长培训、" +
                "医学营销/媒体、" +
                "旅游产品开发/策划)\n");
        }
        if (ope >= ave && con >= ave && keyan >= 3) {
            occ.push("\n科研类:（质量安全、新能源、汽车制造、机械设计/制造、化工、服装/纺织/皮革、" +
                "后端开发、移动开发、硬件开发、高端技术职位、运维/技术支持、数据、电子/半导体、前端开发、人工智能、通信、其他技术职位、测试、" +
                "临床试验、医生/医技、健康整形、生物制药、医疗器械、" +
                "教育产品研发）\n");
        }
        if (con >= ave && renwen >= 3) //49
        {
            occ.push("\n人文类:（咨询/调研、律师、翻译、" +
                "财务、人力资源、行政、法务）\n");
        }
        if (ope >= ave && agr >= ave && con >= ave && cehua >= 3) {
            occ.push("\n策划类:（生产营运、" +
                "高端运营职位、运营、其他运营职位、编辑）\n");
        }
        if (con >= ave && fenxi >= 3) //49
        {
            occ.push("\n分析类:（互联网金融、保险、银行、投融资、风控、税务审计、证券、" +
                "高端市场职位、市场/营销、政府事务、" +
                "房地产：房地产经纪）\n");
        }

        let occ_str = "";
        occ.forEach((val) => {
            occ_str += (val);
        });
        //#endregion

        var ctx = document.getElementById("cv").getContext("2d");

        var radarChartData = {
            labels: ["敏感型", "外向型", "开放型", "理智型", "尽责型", "睿智型", "宜人型"],
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 90, 81, 56, 55, 40]
                },
                {
                    label: "My Second dataset",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: [28, 48, 40, 19, 96, 27, 100]
                }
            ]
        };

        // #region


        const dict = [{
            x: "敏感性",
            y: neu
        },
        {
            x: "外向型",
            y: ext
        },
        {
            x: "开放型",
            y: ope
        },
        {
            x: "宜人型",
            y: agr
        },
        {
            x: "尽责型",
            y: con
        }
        ]

        // //数据源提取
        // const len = dict.length;
        // const xArr = [],
        //     yArr = [],
        //     tmp_yArr = [];
        // for (var i = 0; i < len; i++) {
        //     xArr.push(i * 60);
        //     tmp_yArr.push(dict[i].y);
        // }
        // const tmp_minY = Math.min.apply(Math, tmp_yArr); //最小值
        // const tmp_maxY = Math.max.apply(Math, tmp_yArr); //最大值
        // if (tmp_maxY - tmp_minY <= 100) {
        //     for (let m = 0; m < len; m++) {
        //         yArr.push(tmp_yArr[m] - tmp_minY + 50); //与最小的做比较
        //     }
        // } else {
        //     //如果相差太大会导致图表不美观
        //     for (let n = 0; n < len; n++) {
        //         yArr.push(tmp_yArr[n] / 500);
        //     }
        // }
        // const minY = Math.min.apply(Math, yArr);
        // const maxY = Math.max.apply(Math, yArr);
        // //canvas 准备
        // const canvas = document.getElementById("cv");
        // const ctx = canvas.getContext("2d");
        // //画折线
        // for (let t = 0; t < len; t++) {
        //     const x = xArr[t];
        //     const y = maxY - yArr[t] + minY;
        //     if (i === 0) {
        //         ctx.moveTo(x, y);
        //     } else {
        //         ctx.lineTo(x, y);
        //     }
        // }
        // ctx.stroke();
        // //画点
        // for (let i = 0; i < len; i++) {
        //     const x = xArr[i];
        //     const y = maxY - yArr[i] + minY;
        //     const xMemo = dict[i].x;
        //     const yMemo = dict[i].y;
        //     ctx.beginPath();
        //     ctx.fillStyle = "#000";
        //     ctx.arc(x, y, 2, 0, 2 * Math.PI); //画点
        //     ctx.fill();
        //     ctx.fillText(yMemo, x + 3, y - 10);
        //     ctx.fillText(xMemo, x + 3, canvas.height - 10, 100); //画文字
        // }
        //#endregion 

        //#region 恢复结果
        resultAnchor.setAttribute("herf", "#result");
        resultAnchor.style.cursor = "default";
        resultAnchor.style.opacity = "1";

        resultView.style.display = rawDisplayResult;
        window.location.href = "#result"
        document.getElementById('personality_tex').innerText = most_per;
        document.getElementById('coo_tex').innerText = occ_str;
        new Chart(ctx).Radar(radarChartData, {
            responsive: true
        });
        //#endregion

        //#region net
        // $.ajax({
        //     type: "post",
        //     url: "/question5",
        //     async: true,
        //     data: {
        //         QuestionNumberSelected
        //     },
        //     success: function () {

        //     },
        //     error: function (data) {
        //         alert(data)
        //     }
        // })
        //#endregion
    })


    // Activate scrollspy to add active class to navbar items on scroll
    $("body").scrollspy({
        target: "#sideNav",
    });
})(jQuery); // End of use strict



