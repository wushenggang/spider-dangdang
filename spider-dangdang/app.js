const request=require('request');
const cheerio=require('cheerio');
const path=require('path');
const fs=require('fs');
const charset=require('superagent-charset');                                //解决乱码的问题
const superagent=require('superagent');
charset(superagent)

var url='http://book.dangdang.com/list/newRelease_C01.54.htm'               //当当网 计算机/网络 图书分类页面地址

fs.createWriteStream(path.join(__dirname,`/info/图书资料.txt`))             //创建文本用于存储图书信息

function spider(url){
    superagent
    .get(url)
    .charset('gb2312')
    .end(function(err,res){
        var $=cheerio.load(res.text);
        $('.tushu').each(function(index,ele){                               //遍历图书信息
            var imgSrc=$(this).find('.cover img').attr('src');              //图书图片的地址
            var imgSrcPath=path.parse(imgSrc).base;                         
            var Name=$(this).find('.tushu_right a').text().trim();       //图书的名称
            var content=`${Name}\n`;
            fs.appendFile(path.join(__dirname,`/info/图书资料.txt`),content,function(err){          //添加信息到文本
                if(err){
                    console.log(err)
                }else{
                    request(imgSrc).pipe(fs.createWriteStream(path.join(__dirname,`/img/${imgSrcPath}`)))
                    console.log(`${Name}......信息已保存完毕`)
                }
            })
        })
        var nextLink=$('.fanye_bottom_fd').find('.num_now').next().attr('href');        
        nextLink=`http://book.dangdang.com${nextLink}`;                                             //下一翻页的地址
        spider(nextLink)
    })
}
spider(url);
