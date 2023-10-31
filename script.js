$(document).ready(function () {
  function showErrorIfBlank(inputField, errorElement) {
    if (inputField.val() === "") {
      errorElement.css("visibility", "visible");
      errorElement.text("This field is required");
      return null;
    } else {
      errorElement.css("visibility", "hidden");
      return inputField.val();
    }
  }

  function clearErrorOnInput(inputField, errorElement) {
    inputField.on("input", function () {
      if (inputField.val() !== "") {
        errorElement.css("visibility", "hidden");
      }
    });
  }

  clearErrorOnInput($("#blockSize"), $("#blockSizeError"));
  clearErrorOnInput($("#mainMemorySize"), $("#mainMemorySizeError"));
  clearErrorOnInput($("#cacheMemorySize"), $("#cacheMemorySizeError"));
  clearErrorOnInput($("#cacheAccessTime"), $("#cacheAccessTimeError"));
  clearErrorOnInput($("#memoryAccessTime"), $("#memoryAccessTimeError"));
  clearErrorOnInput($("#fetchSequence"), $("#fetchSequenceError"));
  clearErrorOnInput($("#numFetch"), $("#numFetchError"));

  $("#clear-button").click(function () {
    $("#blockSize").val("");
    $("#mainMemorySize").val("");
    $("#cacheMemorySize").val("");
    $("#cacheAccessTime").val("");
    $("#memoryAccessTime").val("");
    $("#fetchSequence").val("");
    $("#numFetch").val("");

    $(".error-text").css("visibility", "hidden");
  });

  $("#simulate-button").click(function () {
    $("#snapshot").empty();

    var cacheBlocks;

    var blockSize = showErrorIfBlank($("#blockSize"), $("#blockSizeError"));
    var mainMemorySize = showErrorIfBlank(
      $("#mainMemorySize"),
      $("#mainMemorySizeError")
    );
    var mainMemorySizeUnit = $("select[name=mainMemorySizeUnit]").val();
    var cacheMemorySize = showErrorIfBlank(
      $("#cacheMemorySize"),
      $("#cacheMemorySizeError")
    );
    var cacheMemorySizeUnit = $("select[name=cacheMemorySizeUnit]").val();
    var cacheAccessTime = showErrorIfBlank(
      $("#cacheAccessTime"),
      $("#cacheAccessTimeError")
    );
    var memoryAccessTime = showErrorIfBlank(
      $("#memoryAccessTime"),
      $("#memoryAccessTimeError")
    );

    if (cacheMemorySizeUnit == "blocks") {
      cacheBlocks = parseInt(cacheMemorySize);
    } else {
      // TODO: not sure if we should floor or if we should check if the cache memory size is a multiple of the block size
      cacheBlocks = Math.floor(parseInt(cacheMemorySize) / blockSize);
    }

    var fetchSequenceInput = $("#fetchSequence");
    var fetchSequenceError = $("#fetchSequenceError");
    var fetchSequenceValue = showErrorIfBlank(
      fetchSequenceInput,
      fetchSequenceError
    );
    var fetchSequence = fetchSequenceValue
      ? fetchSequenceValue.split(",").map((item) => item.trim())
      : null;

    var fetchSequenceUnit = $("select[name=fetchSequenceUnit]").val();

    if (fetchSequenceUnit == "words") {
      //TODO: not implemented yet.
    }

    var numFetch = showErrorIfBlank($("#numFetch"), $("#numFetchError"));

    if (fetchSequence !== null) {
      const isValidSequence = fetchSequence.every(
        (item) => !isNaN(item) && parseFloat(item) > 0
      );
      if (!isValidSequence) {
        fetchSequenceError.css("visibility", "visible");
        fetchSequenceError.text("Invalid input");
        return;
      }
    }

    if (
      blockSize !== null &&
      mainMemorySize !== null &&
      cacheMemorySize !== null &&
      cacheAccessTime !== null &&
      memoryAccessTime !== null &&
      fetchSequence !== null &&
      numFetch !== null
    ) {
      $("#results").removeClass("hide");

      var snapshots = [];

      var cache = Array(cacheBlocks).fill("_");
      var index = 0;
      var queue = [];
      var hits = 0;
      var misses = 0;

      snapshots.push(cache.slice());

      for (i = 0; i < numFetch; i++) {
        fetchSequence.forEach(function (element, idx) {
          var emptyCount = cache.filter((value) => value === "_").length;

          // if element is not in the cache
          if (!cache.includes(element)) {
            // there is still space in the cache
            if (emptyCount != 0) {
              cache[index] = element;
              index++;
              // the cache is full
            } else {
              cache[cache.indexOf(queue.shift())] = element;
            }
            queue.push(element);
            misses++;
            // if element is in the cache
          } else {
            hits++;
          }
          console.log(cache)
          snapshots.push(cache.slice());
        });
      }

    //   console.log(snapshots)

      var memoryAccessCount = hits + misses;
      var hitRate = hits / memoryAccessCount;
      var missRate = misses / memoryAccessCount;
      var missPenalty =
        (1 * memoryAccessTime + blockSize * memoryAccessTime) / 2;
      var averageAccessTime =
        hitRate * cacheAccessTime + missRate * missPenalty;
      var totalAccessTime =
        hits * blockSize * cacheAccessTime +
        misses * (cacheAccessTime + blockSize * memoryAccessTime);

      $("#hits").text(hits);
      $("#misses").text(misses);
      $("#hitRate").text(hitRate.toFixed(2));
      $("#missRate").text(missRate.toFixed(2));
      $("#memoryAccessCount").text(memoryAccessCount);
      $("#missPenalty").text(missPenalty.toFixed(2) + "ns");
      $("#averageAccessTime").text(averageAccessTime.toFixed(2) + "ns");
      $("#totalAccessTime").text(totalAccessTime + "ns");



      var $snapshotDiv = $("#snapshot");

      var $table = $("<table>").addClass("snapshot-table");

      snapshots.forEach(function (row) {
        var $row = $("<tr>");

        row.forEach(function (cellData) {
          var $cell = $("<td>").text(cellData);
          $row.append($cell);
        });

        $table.append($row);
      });

      $snapshotDiv.append($table);
    }
  });
});
