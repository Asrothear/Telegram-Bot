import mysql from 'mysql';
import winston from 'winston';
import Telegraf from 'telegraf';
import Config from './config.mjs';
var bol = false
const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    maxsize: 500,
    transports: [new winston.transports.File({ filename: 'debug.log'})],
});

/*
logger.error('Error message');
logger.info('Information message');
logger.warn('Warning message');
logger.debug('Some message');
*/

const bot = new Telegraf(Config.token)

function init_db(){
    let DB = mysql.createConnection({
        host: Config.db.host,
        user: Config.db.user,
        password: Config.db.passwort,
        database: Config.db.database
    });

    DB.connect(function(err) {
        if (err){
            log(err);
            logger.error(err);
            return false
        }
    });
    return DB
}

bot.catch((err, ctx) => {
    log(`Error on ${ctx.updateType}: ${err}`)
    logger.error(`Error on ${ctx.updateType}: ${err}`);
})

function db_query(ctx,sql){
    let DB = init_db();
    let bol = DB.query(sql, function (err, result) {
        if (err){
            if(Config.debug){
                ctx.reply("ERROR: "+err.sqlMessage);
            };
            log(err.sqlMessage)
            logger.error(`${get_datetime(0)} - ${get_datetime(1)}: ` + err.sqlMessage);
            return
        };
        log("Database query executed");
        logger.info(`${get_datetime(0)} - ${get_datetime(1)}: Database query executed`)
        if(Config.debug){
            ctx.reply("Database query executed")
        };
        return
    });
    DB.end()
    return bol
}

function log(txt){
    console.log(`Xerxes: ${txt}`)
}

function get_datetime(x)
{
    let date = new Array("","");
    let now = Date();
    date[0] = now.substr(0,15)
    date[1] = now.substr(16,5) + " h"
    return date[x]
}


bot.help((ctx) => ctx.reply('404 hilfe nicht gefunden, schon mal unterm Teppich geschaut ??'))
bot.command('mesast_qrv', mesastqrv)
bot.command('mesast_qrt', mesastqrt)
bot.command('el_qrv', elqrv)
bot.command('el_qrt', elqrt)
bot.command('einsatzmeldung', einsatzmeldung)
bot.command('meldungsabfrage', meldungsabfrage)
bot.command('stabsabfrage', stabsabfrage)

function mesastqrv(ctx, next){
    let user = ctx.from.username
    let table = 'bereitschaftslog'
    let sql = `INSERT INTO ${table} (time, user, rang, status) VALUES("${get_datetime(0)} - ${get_datetime(1)}", "${user}", "MESAST", "aktiv");`
    let result = db_query(ctx,sql)
    let msg = `${user} meldet sich als MESAST QRV`
    if(result){
        ctx.reply(msg)
    };
    logger.info(`${get_datetime(0)} - ${get_datetime(1)}: ` + msg);
}
function mesastqrt(ctx, next){
    let user = ctx.from.username
    let table = 'bereitschaftslog'
    let sql =`INSERT INTO ${table} (time, user, rang, status) VALUES("${get_datetime(0)} - ${get_datetime(1)}", "${user}", "MESAST", "inaktiv");`
    let result = db_query(ctx,sql)
    let msg = `${user} meldet sich als MESAST ab`
    if(result){
        ctx.reply(msg)
    };
    logger.info(`${get_datetime(0)} - ${get_datetime(1)}: ` + msg);
}
function elqrv(ctx, next){
    let user = ctx.from.username
    let table = 'bereitschaftslog'
    let sql =`INSERT INTO ${table} (time, user, rang, status) VALUES("${get_datetime(0)} - ${get_datetime(1)}", "${user}", "EL", "aktiv");`
    let result = db_query(ctx,sql)
    let msg = `${user} meldet sich als EL QRV`
    if(result){
        ctx.reply(msg)
    };
    logger.info(`${get_datetime(0)} - ${get_datetime(1)}: ` + msg);
}
function elqrt(ctx, next){
    let user = ctx.from.username
    let table = 'bereitschaftslog'
    let sql = `INSERT INTO ${table} (time, user, event) VALUES("${get_datetime(0)} - ${get_datetime(1)}", "${user}", "el inaktiv");`
    let result = db_query(ctx,sql)
    let msg = `${user} meldet sich als EL ab`
    if(result){
        ctx.reply(msg)
    };
    logger.info(`${get_datetime(0)} - ${get_datetime(1)}: ` + msg);
}
function einsatzmeldung(ctx, next){
    let user = ctx.from.username
    let table = 'einsatzmeldungen'
    let txt = ctx.message.text.substr(ctx.message.text.indexOf(" ") + 1);
    let sql = `INSERT INTO ${table} (time, user, meldung) VALUES("${get_datetime(0)} - ${get_datetime(1)}", "${user}", "${txt}");`
    let result = db_query(ctx,sql)
    if(result){
        ctx.reply("Meldung gelogt")
    };
    logger.info(`${get_datetime(0)} - ${get_datetime(1)}: Meldung gelogt| ${user}: ${txt}`);
}
async function meldungsabfrage(ctx, next){
    let user = ctx.from.username
    let count = 5
    let table = 'einsatzmeldungen'
    let DB = init_db()
    DB.query(`SELECT * FROM ${table} ORDER BY id DESC LIMIT ${count};`, function (err, result, fields) {
        if (err){
            log(err);
            logger.error(`${get_datetime(0)} - ${get_datetime(1)}: ` + err);
            return
        }
        let msg = " "
        result.slice().reverse().forEach(x => {
            msg =  msg + `${x.time} ${x.user} ${x.event}\n`
        });
        ctx.reply(msg)
    });
    logger.info(`${get_datetime(0)} - ${get_datetime(1)}: meldungsabfrage generiert.`);
    DB.end()
}
async function stabsabfrage(ctx, next){
    let user = ctx.from.username
    let count = 2
    let table = "bereitschaftslog"
    let DB = init_db()
    DB.query(`SELECT * FROM ${table} where status = "aktiv" ORDER BY id DESC LIMIT ${count};`, function (err, result, fields) {
        if (err){
            log(err);
            logger.error(`${get_datetime(0)} - ${get_datetime(1)}: ` + err);
            return
        }
        let msg = " "
        result.forEach(x => {
            msg =  msg + `${x.user} = ${x.rang}\n`
        });
        ctx.reply(msg)
    });
    logger.info(`${get_datetime(0)} - ${get_datetime(1)}: bereitschaftslog abfrage generiert.`);
    DB.end()
}
bot.launch()