var snapshots = [];
var cacheBlocks;
var blockSize;
var mainMemoryBlocks;
var mainMemorySizeUnit;
var cacheBlocks;
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

    cacheBlocks = showErrorIfBlank(
      $("#cacheMemorySize"),
      $("#cacheMemorySizeError")
    );
    cacheMemorySizeUnit = $("select[name=cacheMemorySizeUnit]").val();
	cacheBlocks = parseInt(cacheBlocks);
	if (cacheMemorySizeUnit == "words") {
		if (cacheBlocks % blockSize !== 0) {
			showError($("#cacheMemorySizeError"), "Cache memory size must be a multiple of the block size");
			cacheBlocks = null;
		} else {
			cacheBlocks = Math.floor(cacheBlocks / blockSize);
			cacheMemorySizeUnit = "blocks";
		}
	}
	if (cacheBlocks <= 0) {
		showError($("#cacheMemorySizeError"), "Cache memory size must be greater than 0");
		cacheBlocks = null;
	}
	if (isNaN(cacheBlocks))
		cacheBlocks = null;

	if (mainMemoryBlocks < cacheBlocks)
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
	fetchSequenceInput.val(fetchSequenceInput.val().replaceAll(/[^\d]+/g, ' ').trim())
    var fetchSequenceError = $("#fetchSequenceError");
    var fetchSequenceValue = showErrorIfBlank(
      fetchSequenceInput,
      fetchSequenceError
    );
    fetchSequence = fetchSequenceValue === null ? null :
		fetchSequenceValue.split(" ").map((item) => parseInt(item))

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
	  for (const val of fetchSequence) {
		if (isNaN(val))
			showError(fetchSequenceError, "Invalid sequence");
		else if (val >= max)
			showError(fetchSequenceError, `Cannot fetch ${val} from main memory`);
		else if (val < 0)
			showError(fetchSequenceError, `Cannot fetch negative address ${val}`);
		else
			continue;
		fetchSequence = null;
		break;
	  }
    }
	return (
		blockSize !== null &&
		mainMemoryBlocks !== null &&
		cacheBlocks !== null &&
		cacheAccessTime !== null &&
		memoryAccessTime !== null &&
		fetchSequence !== null &&
		numFetch !== null
	)
  }
  $("#simulate-button").click(function () {
    $("#snapshot").empty();
	if (!getValues()) return;

    if (fetchSequenceUnit == "words") {
      //TODO: not implemented yet.
	  return
    }

	var cache = Array(cacheBlocks).fill("_");
	var index = 0;
	var hits = 0;
	var misses = 0;
	snapshots = [cache.slice()];
	console.log(cache);

	for (let i = 0; i < numFetch; i++) {
	  fetchSequence.forEach((element) => {
		// if element is not in the cache
		if (!cache.includes(element)) {
			cache[index] = element;
			index = (index + 1) % cacheBlocks;
			misses++;
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
	  (1 * memoryAccessTime + blockSize * memoryAccessTime) / 2 + cacheAccessTime;
	var averageAccessTime =
	  hitRate * cacheAccessTime + missRate * missPenalty;
	var totalAccessTime =
	  hits * blockSize * cacheAccessTime +
	  misses * (cacheAccessTime + blockSize * (memoryAccessTime + cacheAccessTime));

	$("#results").removeClass("hide");

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
