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
      cacheBlocks = parseInt(cacheMemorySize) / blockSize;
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
      //   console.log("Block Size:", blockSize);
      //   console.log("Main Memory Size:", mainMemorySize, mainMemorySizeUnit);
      //   console.log("Cache Memory Size:", cacheMemorySize, cacheMemorySizeUnit);
      //   console.log("Cache Access Time:", cacheAccessTime);
      //   console.log("Memory Access Time:", memoryAccessTime);
      //   console.log("Fetch Sequence:", fetchSequence, fetchSequenceUnit);
      //   console.log("Number of times fetched:", numFetch);

      var cache = Array(cacheBlocks).fill(-1);
      var index = 0;
      var queue = [];
      var hits = 0;
      var misses = 0;

      for (i = 0; i < numFetch; i++) {
        fetchSequence.forEach(function (element, idx) {
          var emptyCount = cache.filter((value) => value === -1).length;

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
          } else {
            hits++;
          }
          console.log(cache);
        });
      }

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

      console.log("Hits:", hits);
      console.log("Misses:", misses);
      console.log("Memory Access Count:", memoryAccessCount);
      console.log("Hit Rate:", hitRate);
      console.log("Miss Rate:", missRate);
      console.log("Miss Penalty:", missPenalty);
      console.log("Average Access Time:", averageAccessTime);
      console.log("Total Access Time:", totalAccessTime);
    }
  });
});
