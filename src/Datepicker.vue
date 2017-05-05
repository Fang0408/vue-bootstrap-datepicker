/**
 * Datepicker.vue
 * version: 1.0.0
 */
<template>
    <div @click.stop class="datetimepicker datetimepicker-dropdown-bottom-right dropdown-menu" :style="{'left': left, 'top': top}" :class="{'show': show}" >
        <div class="datetimepicker-days" :class="{'show': show}">
            <table class="table-condensed">
                <thead>
                    <tr>
                        <th class="prev" style="visibility: visible;" @click="prev">
                            <i class="glyphicon glyphicon-arrow-left"></i>
                        </th>
                        <th colspan="5" class="switch">{{monthsConf[displayMonth]}} {{displayYear}}</th>
                        <th class="next" style="visibility: visible;" @click="next">
                            <i class="glyphicon glyphicon-arrow-right"></i>
                        </th>
                    </tr>
                    <tr>
                        <th class="dow" v-for="day in daysConf">
                            {{day}}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="i in Math.ceil(dates.length / 7)">
                        <template v-for="j in 7">
                            <td class="day" v-if="dates[(i - 1) * 7 - 1 + j] == 0"></td>
                            <td class="day" v-else @click="select(displayYear, displayMonth, dates[(i - 1) * 7 - 1 + j])" :class="{'active': (displayYear == selectYear && displayMonth == selectMonth && dates[(i - 1) * 7 - 1 + j] == addZero(selectDate) )}">{{ dates[(i - 1) * 7 - 1 + j] }}</td>
                        </template>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                config: {
                    'zh-CN': {
                        daysConf: ['一', '二', '三', '四', '五', '六', '日'],
                        monthsConf: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
                    },
                    'en-US': {
                        daysConf: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        monthsConf: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    }
                },
                daysConf: [],
                monthsConf: [],
                show: false,
                currentTime: undefined,
                currentYear: 0,
                currentMonth: 0,
                currentDate: 0,
                dates: [],
                displayTime: undefined,
                displayYear: 0,
                displayMonth: 0,
                displayDate: 0,
                selectDate: '',
                selectTime: '',
                selectYear: '',
                selectMonth: ''
            }
        },
        props: {
            'lang': {
                type: String,
                default: 'zh-CN'
            },
            'type': {
                type: String,
                default: 'date'
            },
            value: {
                type: Boolean,
                default: false
            },
            'left': {
                default: '0'
            },
            'top': {
                default: '0'
            },
            param: {
                type: String,
                required: true
            },
            defaultDate: {
                type: String
            }
        },
        methods: {
            openDatepicker () {
                this.init();
                this.show = true;
            },
            closeDatepicker () {
                this.show = false;
                this.$emit('input', false);
            },
            select (year, month, date) {
                let time = new Date(year, month, date);

                this.selectTime = `${year}-${this.addZero(month + 1)}-${date}`;
                this.selectYear = year;
                this.selectMonth = month;
                this.selectDate = date;
                this.$emit('select-date', this.param, this.selectTime);

                this.closeDatepicker();

            },
            addZero (n) {
                n = parseInt(n, 10);
                return n < 10 ? '0' + n : '' + n; 
            },
            prev () {
                let date = new Date(this.displayTime);
                date.setMonth(date.getMonth() - 1);
                this.render(date);
            },
            next () {
                let date = new Date(this.displayTime);
                date.setMonth(date.getMonth() + 1);
                this.render(date);
            },
            render (date) {
                let month = date.getMonth();
                let year = date.getFullYear();

                // 设置为当月首日
                date.setDate(1);
                // 获取星期偏移量
                let offset = this.getDayOffset(date.getDay());
                
                // 获取当月天数
                let totalDate = this.getCurrentMonthDates(date);

                // 初始化渲染的日期
                this.dates = [];

                // 填充偏移量，设置为0
                for(let i = 0; i < offset; i++) {
                    this.dates.push(0);
                }

                // 填充日期
                for(let i = 0; i < totalDate; i++) {
                    this.dates.push(this.addZero(i + 1));
                }

                this.displayYear = year;
                this.displayMonth = month;
                this.displayDate = date.getDate();

                // 重置当前展示的日期
                this.displayTime = new Date(year, month, date.getDate());
            },
            /**
             * 获取当月天数
             */
            getCurrentMonthDates (date) {
                date = new Date(date);
                let month = date.getMonth();
                date.setMonth(month + 1);
                let temp = new Date(Date.parse(date) - 24 * 60 * 60 * 1000);
                return temp.getDate();
            },
            init () {

                this.daysConf = this.config[this.lang] ? this.config[this.lang]['daysConf'] : this.config['zh-CN']['daysConf'];
                this.monthsConf = this.config[this.lang] ? this.config[this.lang]['monthsConf'] : this.config['zh-CN']['monthsConf'];

                this.currentTime = new Date(); 
                this.currentYear = this.currentTime.getFullYear();
                this.currentMonth = this.currentTime.getMonth();
                this.currentDate = this.currentTime.getDate();
            
                this.selectYear = this.currentYear;
                this.selectMonth = this.currentMonth;
                this.selectDate = this.currentDate;
                
                this.render(this.currentTime)

                document.addEventListener('click', this.closeDatepicker);
            },
            /**
             * 星期偏移量
             */
            getDayOffset (day) {
                return day - 1;
            }
        },
        watch: {
            value (val) {
                if(val) {
                    this.openDatepicker();
                }
            },
            defaultDate (val) {
                if(val && /\d{4}-\d{1,2}-\d{1,2}/.test(val)) {
                    let temp = this.defaultDate.split('-');
                    this.selectYear = parseInt(temp[0], 10);
                    this.selectMonth = parseInt(temp[1], 10) - 1;
                    this.selectDate = temp[2];

                    this.render(new Date(this.selectYear, this.selectMonth, this.selectDate));
                }else{
                    this.selectYear = this.currentYear;
                    this.selectMonth = this.currentMonth;
                    this.selectDate = this.currentDate;
                }
            }
        },
        mounted () {
            this.$nextTick(() => {
                this.init();
            })
        }
    }
</script>
<style>

</style>