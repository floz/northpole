Loader = require "loader/Loader"
Experiment = require "experiment/Experiment"

start = ->
    experiment = new Experiment()
    experiment.start()

loader = new Loader
loader.on "complete", start
loader.load()
