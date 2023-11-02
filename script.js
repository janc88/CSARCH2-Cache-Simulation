var snapshots = [];
var cacheBlocks;
var blockSize;
var mainMemoryBlocks;
var mainMemorySizeUnit;
var cacheMemoryBlocks;
var cacheMemorySizeUnit;
var cacheAccessTime;
var memoryAccessTime;
var fetchSequence;
var fetchSequenceUnit;
var numFetch;

$(document).ready(function () {
  function showError($el, msg = "This field is required") {
	$el.css("visibility", "visible");
	if (msg !== null)
		$el.text(msg);
  }
  function hideError($el) {
	$el.css("visibility", "hidden");
  }
  function showErrorIfBlank(inputField, errorElement) {
    if (inputField.val() === "") {
      showError(errorElement);
      return null;
    } else {
      hideError(errorElement)
      return inputField.val();
    }
  }

  function clearErrorOnInput(inputField, errorElement) {
    inputField.on("input", function () {
      if (inputField.val() !== "") {
        hideError(errorElement);
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

  const clearHandler = () => {
    $("#blockSize").val("");
    $("#mainMemorySize").val("");
    $("#cacheMemorySize").val("");
    //$("#cacheAccessTime").val("1");
    //$("#memoryAccessTime").val("10");
    $("#fetchSequence").val("");
    //$("#numFetch").val("1");

    $(".error-text").css("visibility", "hidden");
  }
  $("#clear-button").click(clearHandler);

  function getValues() {

    blockSize = showErrorIfBlank($("#blockSize"), $("#blockSizeError"));
	blockSize = parseInt(blockSize);

    mainMemoryBlocks = showErrorIfBlank(
      $("#mainMemorySize"),
      $("#mainMemorySizeError")
    );
    mainMemorySizeUnit = $("select[name=mainMemorySizeUnit]").val();
	mainMemoryBlocks = parseInt(mainMemoryBlocks);
	if (mainMemorySizeUnit == "words") {
		if (mainMemoryBlocks % blockSize !== 0) {
			showError($("#mainMemorySizeError"), "Main memory size must be a multiple of the block size");
			mainMemoryBlocks = null;
		} else {
			mainMemoryBlocks = Math.floor(mainMemoryBlocks / blockSize);
			mainMemorySizeUnit = "blocks";
		}
	}
	if (mainMemoryBlocks <= 0) {
		showError($("#mainMemorySizeError"), "Main memory size must be greater than 0");
		mainMemoryBlocks = null;
	}
	if (isNaN(mainMemoryBlocks))
		mainMemoryBlocks = null;

    cacheMemoryBlocks = showErrorIfBlank(
      $("#cacheMemorySize"),
      $("#cacheMemorySizeError")
    );
    cacheMemorySizeUnit = $("select[name=cacheMemorySizeUnit]").val();
	cacheMemoryBlocks = parseInt(cacheMemoryBlocks);
	if (cacheMemorySizeUnit == "words") {
		if (cacheMemoryBlocks % blockSize !== 0) {
			showError($("#cacheMemorySizeError"), "Cache memory size must be a multiple of the block size");
			cacheMemoryBlocks = null;
		} else {
			cacheMemoryBlocks = Math.floor(cacheMemoryBlocks / blockSize);
			cacheMemorySizeUnit = "blocks";
		}
	}
	if (cacheMemoryBlocks <= 0) {
		showError($("#cacheMemorySizeError"), "Cache memory size must be greater than 0");
		cacheMemoryBlocks = null;
	}
	if (isNaN(cacheMemoryBlocks))
		cacheMemoryBlocks = null;

	if (mainMemoryBlocks < cacheMemoryBlocks)
		showError($("#mainMemorySizeError"), "Main memory size must be greater than or equal to cache memory size");

    cacheAccessTime = showErrorIfBlank(
      $("#cacheAccessTime"),
      $("#cacheAccessTimeError")
    );
	cacheAccessTime = parseInt(cacheAccessTime);
	if (cacheAccessTime <= 0) {
		showError($("#cacheAccessTimeError"), "Cache access time must be greater than 0");
		cacheAccessTime = null;
	}
	if (isNaN(cacheAccessTime)) cacheAccessTime = null;
    memoryAccessTime = showErrorIfBlank(
      $("#memoryAccessTime"),
      $("#memoryAccessTimeError")
    );
	memoryAccessTime = parseInt(memoryAccessTime);
	if (memoryAccessTime <= 0) {
		showError($("#memoryAccessTimeError"), "Memory access time must be greater than 0");
		memoryAccessTime = null;
	}
	if (isNaN(memoryAccessTime)) memoryAccessTime = null;

    var fetchSequenceInput = $("#fetchSequence");
    var fetchSequenceError = $("#fetchSequenceError");
    var fetchSequenceValue = showErrorIfBlank(
      fetchSequenceInput,
      fetchSequenceError
    );
    fetchSequence = fetchSequenceValue === null ? null :
		fetchSequenceValue.replaceAll(/[^\d]+/g, ' ').trim().split(" ").map((item) => parseInt(item))

    fetchSequenceUnit = $("select[name=fetchSequenceUnit]").val();

    numFetch = showErrorIfBlank($("#numFetch"), $("#numFetchError"));
	numFetch = parseInt(numFetch);
	if (numFetch <= 0) {
		showError($("#numFetchError"), "Number of fetches must be greater than 0");
		numFetch = null;
	}
	if (isNaN(numFetch)) numFetch = null;

    if (fetchSequence !== null) {
	  let max = mainMemoryBlocks
	  if (fetchSequenceUnit == "words") max *= blockSize;
      const isValidSequence = fetchSequence.every(
        (item) => !isNaN(item) && item >= 0 && item < max
      );
      if (!isValidSequence) {
        showError(fetchSequenceError, "Invalid sequence");
        fetchSequence = null;
      }
    }
	return (
		blockSize !== null &&
		mainMemoryBlocks !== null &&
		cacheMemoryBlocks !== null &&
		cacheAccessTime !== null &&
		memoryAccessTime !== null &&
		fetchSequence !== null &&
		numFetch !== null
	)
  }
  $("#simulate-button").click(function () {
    $("#snapshot").empty();
	if (!getValues()) return;

	$("#results").removeClass("hide");

    if (fetchSequenceUnit == "words") {
      //TODO: not implemented yet.
    }

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
		console.log(cache);
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
});

  $("#download-button").click(function () {
    var snapshotsText = snapshots.map((row) => row.join(" ")).join("\n");
    var blob = new Blob([snapshotsText], { type: "text/plain" });
    var url = URL.createObjectURL(blob);

    var a = $("<a>")
      .attr("href", url)
      .attr("download", "snapshots.txt")
      .appendTo("body")
      .css("display", "none");

    a[0].click();
    a.remove();
    URL.revokeObjectURL(url);
  });
});
