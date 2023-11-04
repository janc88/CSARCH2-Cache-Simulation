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
var bitsPerWord;
var tableState;
var sampleData

$(document).ready(function () {
  sampleData = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In turpis nisi, scelerisque sit amet elit eu, suscipit pharetra enim. Nam suscipit faucibus suscipit. Mauris consectetur ut arcu eget interdum. Cras facilisis dignissim libero, ac iaculis ex ullamcorper nec. Fusce dapibus, tortor non eleifend commodo, sem nisl blandit eros, vitae volutpat lectus justo id nisi. Vivamus odio sapien, gravida quis arcu in, luctus maximus urna. Phasellus ut ullamcorper dui, nec placerat odio. Vestibulum posuere lorem magna, non vulputate nisl ultrices vitae. Suspendisse tincidunt purus eu turpis eleifend, sit amet dapibus metus imperdiet. Sed vitae erat in augue efficitur mollis. Donec faucibus urna at risus venenatis, sit amet sodales elit molestie. Vivamus mollis, mi sollicitudin cursus dictum, risus justo rhoncus ipsum, sed volutpat libero urna ac risus. Pellentesque ac sem lectus. Cras fringilla elit vel eros tristique sollicitudin.Ut vitae est id sapien euismod dapibus. Vestibulum ut posuere nisl. Vestibulum rutrum odio et nunc aliquet porttitor. Morbi efficitur sed arcu vel bibendum. Praesent arcu risus, tempus ultricies vestibulum non, finibus vel odio. Maecenas at blandit orci. Duis lobortis erat facilisis, iaculis justo quis, ornare enim. Mauris eu nunc blandit, pulvinar mi vel, dictum leo. Etiam blandit in nulla et pulvinar. Curabitur luctus felis purus, nec tempor magna scelerisque nec. Nulla pellentesque justo purus, nec commodo nisi ornare at. Etiam nibh urna, eleifend ut felis a, suscipit tristique nibh. Suspendisse potenti. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ornare varius bibendum. Integer risus metus, laoreet dignissim velit nec, maximus ultrices nibh. Phasellus elementum neque quis mauris hendrerit, non posuere ipsum pulvinar. Pellentesque volutpat nisi sed enim eleifend pharetra. Pellentesque mattis est eget dolor ullamcorper mollis. Aenean nec egestas lorem. In auctor pulvinar maximus. Donec vestibulum massa quis mauris cursus, et viverra purus lacinia. Nullam sit amet massa ut sapien dictum vehicula ut eget leo. Mauris sem ligula, vehicula in dignissim eu, accumsan et nunc. Praesent sed sodales magna. Integer varius nisi eu arcu pharetra consequat. Praesent ultricies malesuada nulla, ac volutpat turpis porta eu. Donec vehicula, mi eu scelerisque tincidunt, orci lacus vulputate dui, vel condimentum erat orci ac ipsum. Aliquam erat volutpat. Integer lectus libero, sagittis vitae interdum vitae, dictum vitae dolor. Sed fermentum, ex in scelerisque faucibus, tortor arcu cursus diam, sed sodales erat tellus quis nibh. Suspendisse auctor sed leo sed consectetur. Proin nec fringilla eros. Ut nisl nunc, congue vitae consequat sit amet, blandit faucibus nisl. Duis gravida tellus nunc, id gravida lorem porttitor id. Proin sodales vel sem eu placerat. Sed feugiat ex eget libero vestibulum auctor. Nulla a tincidunt felis. Sed feugiat facilisis ligula, quis tempus enim congue vitae. Curabitur sollicitudin nulla metus, in porttitor ex maximus a. Donec tincidunt tempus odio in congue. Integer eros est, vehicula vel libero sed, tristique venenatis odio. Integer vehicula eros a dapibus molestie. Etiam blandit ligula velit, in efficitur orci tempus at. Phasellus ac aliquet diam, ut viverra purus. Nulla molestie sem augue, vel ultricies magna mollis a.';
  sampleData = sampleData.split('').map((c) => c.charCodeAt(0).toString(2).padStart(8, '0')).join('');
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
	bitsPerWord = showErrorIfBlank($("#bitsPerWord"), $("#bitsPerWordError"));
	bitsPerWord = parseInt(bitsPerWord);
	if (isNaN(bitsPerWord))
		bitsPerWord = null;
	else if (bitsPerWord <= 0) {
		showError($("#bitsPerWordError"), "Bits per word must be greater than 0");
		bitsPerWord = null;
	} else if (Math.log2(bitsPerWord) % 1 !== 0) {
		showError($("#bitsPerWordError"), "Bits per word must be a power of 2");
		bitsPerWord = null;
	}

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
  resetTable();
});

function toHex(num, digits) {
	return num.toString(16).padStart(digits, "0");
}
function getData(address) {
	const ind = address * bitsPerWord;
	return sampleData.slice(ind, ind + bitsPerWord);
}
function bitStringToHex(bitString) {
	let hex = [];
	bitString = bitString.padStart(Math.ceil(bitString.length / 4) * 4, "0");
	for (let i = 0; i < bitString.length; i += 4)
		hex.push(
			parseInt(bitString.slice(i, i + 4), 2).toString(16)
		)
	return hex.join("");
}
// for block 
function generateAccessSequence() {
	const nextBlock = tableState.sequence[tableState.sequenceIndex];
	let cacheLoc = tableState.data.findIndex((block) => block.tag === nextBlock);
	
	const cacheTime = cacheAccessTime;
	const memoryTime = memoryAccessTime
	const operations = [];
	tableState.operations = operations;

	operations.push(() => {
		tableState.desc = `Fetching block: ${nextBlock}`
		tableState.sequenceIndex++;
	});

	if (cacheLoc !== -1) {
		operations.push(() => {
			tableState.desc = `Block ${nextBlock} is already in the cache (${cacheLoc}); hits + 1`
			tableState.hits++;
			tableState.averageAccessTime = (
				tableState.hits * cacheTime + 
				tableState.misses * tableState.missPenalty
				) / (tableState.hits + tableState.misses);
		})
		for (let i=0; i < blockSize; i++) {
			const wordAddress = nextBlock * blockSize + i;
			const cacheAddress = cacheLoc * blockSize + i;
			operations.push(() => {
				tableState.desc = `Accessing word ${wordAddress} from cache (${cacheAddress}); total access time + cache access time`
				tableState.totalAccessTime += cacheTime;
				tableState.data[cacheLoc].accessHistory.push(wordAddress);
			});
		}
		return;
	}
	cacheLoc = tableState.cacheIndex;
	operations.push(() => {
		tableState.desc = `Block ${nextBlock} is not in the cache; misses + 1; total + cache access time (for checking)`
		tableState.misses++;
		tableState.averageAccessTime = (
			tableState.hits * cacheTime + 
			tableState.misses * tableState.missPenalty
			) / (tableState.hits + tableState.misses);
		tableState.totalAccessTime += cacheTime;
		tableState.data[cacheLoc].valid = '1';
		tableState.data[cacheLoc].tag = nextBlock;
		tableState.cacheIndex = (cacheLoc + 1) % cacheBlocks;
	});
	
	for (let i = 0; i < blockSize; i++) {
		const wordAddress = nextBlock * blockSize + i;
		const data = toHex(getData(wordAddress), tableState.dataHex);
		const mmBlockAddress = Math.floor(wordAddress / blockSize);
		const cacheAddress = cacheLoc * blockSize + i;
		const arr = tableState.data[cacheLoc]
		operations.push(() => {
			tableState.desc = `Accessing word ${wordAddress} from main memory block ${mmBlockAddress} (cache ${cacheAddress}); total access time + cache access time + memory access time`
			tableState.totalAccessTime += cacheTime + memoryTime;
			arr.accessHistory.push(wordAddress);
			arr.data[i] = bitStringToHex(data);
			arr.address[i] = wordAddress;
		});
	}
	return;
}
function renderTable() {
	const $results = $("#table");
	$results.empty();
	$('#table-hits').text(tableState.hits);
	$('#table-misses').text(tableState.misses);
	$('#table-desc').text(tableState.desc);
	$('#table-totalAccessTime').text(tableState.totalAccessTime);
	$('#table-averageAccessTime').text(tableState.averageAccessTime);
	// table headers:
	// Cache block | Valid bit | Tag | Data | MM address | access history
	for (const block of tableState.data) {
		let row = $("<tr>");
		row.append($("<td>").text(block.block).attr('rowspan', blockSize))
		row.append($("<td>").text(block.valid).attr('rowspan', blockSize))
		row.append($("<td>").text(block.tag).attr('rowspan', blockSize))
		for (let i = 0; i < blockSize; i++) {
			row.append($("<td>").text(block.data[i]))
			row.append($("<td>").text(block.address[i]))
			row.append($("<td>").text(block.accessHistory[i].join(", ")))
			$results.append(row)
			row = $("<tr>")
		}
	}
}
function resetTable() {
	$('#table-container').removeClass("hide");

	const dataHex = Math.ceil(Math.log2(bitsPerWord) / 4);
	tableState = {
		// table parameters
		dataHex,
		missPenalty: (1 * memoryAccessTime + blockSize * memoryAccessTime) / 2 + cacheAccessTime,
		sequenceUnit: fetchSequenceUnit,
		sequence: Array(numFetch).fill(fetchSequence).flat(),
		// table state
		cacheIndex: 0,
		sequenceIndex: 0,
		operations: [],
		data: [],
		hits: 0,
		misses: 0,

		totalAccessTime: 0,
		averageAccessTime: 0,

		desc: ''
	};
	for (let cacheBlock = 0; cacheBlock < cacheBlocks; cacheBlock++) {
		tableState.data.push({
			// block parameters
			block: cacheBlock,
			// block state
			valid: '0',
			tag: '_ (invalid)',
			data: Array(blockSize).fill('_'.repeat(dataHex)),
			address: Array(blockSize).fill('_ (invalid)'),
			accessHistory: Array(blockSize).fill().map(() => [])
		});
	}
	renderTable();
}
$('#table-step-button').click(function() {
	if (tableState.operations.length === 0) {
		if (tableState.sequenceIndex >= tableState.sequence.length) 
			return;
		generateAccessSequence();
	}
	tableState.operations.shift()();
	renderTable();
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
