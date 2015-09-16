// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   daemon.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: ppeltier <dev@halium.fr>                   +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2015/09/14 18:24:10 by ppeltier          #+#    #+#             //
//   Updated: 2015/09/14 21:54:24 by ppeltier         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //


var ts = require('torrent-stream')
var path = require('path')
var async = require('async')

function TsPoc () {
    this.listEngines = []
}

TsPoc.prototype.newDownload = function (magnet) {
    console.log('plip')
    var options = {
        connections: 100,     // Max amount of peers to be connected to.
        tmp: path.join(__dirname, '../tmp'),          // Root folder for the files storage.
        tracker: false // Allows to declare additional tracks
    }

    console.log('start engine')
    var engine = ts(magnet, options) // Create the engine

    this.listEngines.push(engine)

    return engine
}


    //engine.on('ready', function () {
        //console.log('engine ready')
        //callback(engine)
    //})

TsPoc.prototype.stopAllDownloads = function () {
    var queue = async.queue(function (engine, next) {
        elem.destroy(function () {
            next()
        }), 10})

    queue.drain = function () {
        console.log('all Download are deleted')
        this.listEngines.length = 0
    }

    queue.push(this.listEngines)
}


module.exports = new TsPoc
