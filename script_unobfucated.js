	// Global Var's
		var L_von_G_Instanz;
		var ProduktionsregelGenerator_Instanz;
		var produktionsregel;
		var word;
		var wordlist;
		var eingabe;


		// In-Output Handler
		function IOhandler(par_eingabe,par_wordlist){
			eingabe = par_eingabe;
			wordlist = par_wordlist;
			L_von_G_Instanz.erzeugeAusgabe()
		}
		// ProduktionsregelGenerator Klasse
		function ProduktionsregelGenerator(){
			this.encode = function(){
					produktionsregel = [];
				var x = document.getElementById("produktionsregel").value;
				var zeilen = x.split("\n");
				zeilen.forEach(function callback(v,k){
					if(v.indexOf("->")>=0){
						var zeile = v.split("->");
						var linkeSeite = zeile[0];
						if(zeile[1]){
							var rechteSeite = zeile[1].replace(',','').split("|");
							var regel = [linkeSeite,rechteSeite];
							produktionsregel.push(regel);	
						}
					}
				});
			}

			this.decode = function(x){
				var ausgabe="";
				produktionsregel.forEach(function callback(v,k){
					ausgabe += v[0]+"->";
					v[1].forEach(function callback(val,key){
						if(key<v[1].length-1){ // letzer Item vertikal
							ausgabe += val+"|";
						}else{
							ausgabe += val;
							if(k<produktionsregel.length-1){ // letzer Item horizontal
								ausgabe +=",\n";
							}
						}
					});
				});
				document.getElementById("produktionsregel").value=ausgabe;
			}
		}

		// L(G)-Sprache Klasse
		function L_von_G(){
			this.erzeugeSchritte = function(){
				var ausgabe='';  // Ausgabe buffer -> return Wert
				if(eingabe!="" && wordlist!=""){
					var _wordlist_ = wordlist.split("|");
					var _schritte_ = eingabe.split("|");
					var letzeEingabe = [];
						letzeEingabe = _schritte_[_schritte_.length-1].split("-");
					var suche = produktionsregel[letzeEingabe[0]][0];
					var ersetze = produktionsregel[letzeEingabe[0]][1][letzeEingabe[1]];
						word = word.replace(suche,ersetze); // Satzform-Übergang mit letze Eingabe
					_schritte_.forEach(function callback(v, k){ // Ausgabe der Schritte
						var kp = 0;
						var splitEingabe = v.split("-");
							ausgabe += '<div class="bordering schritt">';
							splitEingabe.forEach(function callback(y, x){
								if(x==0){
									var wordlist_ausgabe = _wordlist_[k].replace(produktionsregel[y][0],'<span class="text-red">'+produktionsregel[y][0]+'</span>');
									ausgabe += '<span class="bordering ausgangspunkt">'+wordlist_ausgabe+'</span>:';
									ausgabe += '<span class="bordering nicht_terminal">'+produktionsregel[y][0]+'</span> => ';
									kp=y;
								}else{
									ausgabe += '<span class="bordering regel">'+produktionsregel[kp][1][y]+'</span>';
								}
							});

						ausgabe += '</div>';
					});
				}else{
					ausgabe ='<div class="bordering schritt">Klicke auf die gelben Kästchen!</div>';
				}
				return ausgabe;
			};

			this.erzeugeEingabe = function(){
				if(produktionsregel.length==0){
					produktionsregel = [["S",["aS","a"]]];
					ProduktionsregelGenerator_Instanz.decode(produktionsregel);
				}
					wordlist = wordlist + word + '|';
				var ausgabe = ''; // Ausgabe buffer -> return Wert
				var word_backup = word;
				var determiniert = true;
				produktionsregel.forEach(function callback(v, k){
					if(word.indexOf(v[0])>=0){
						ausgabe += '<p>';
						word_backup = word_backup.replace(v[0], '<span class="bordering terminal">'+v[0]+'</span>');
						var waehlbar = true;
						determiniert = false;
					}else{
						var waehlbar = false;
						ausgabe += '<p class="unwaehlbar">';
					}
					ausgabe += '<span class="bordering nicht_terminal">'+v[0]+'</span> ->';
						v[1].forEach(function callback(val, key){
							if(waehlbar){
								var add = '';
								if(eingabe!=''){
									add = '|';
								}
								give = '<span class="bordering regel click" onclick="IOhandler(\''+eingabe+add+k+'-'+key+'\',\''+wordlist+'\');">'+val+'</span>';
							}else{
								give = '<span class="bordering regel">'+val+'</span>';
							}
							ausgabe += give;
						});

						
					ausgabe += '</p>';
				});

				// End Grammatik-Checker (statisch für a^n b^m+1 a^n+1 b^m)
				var output = "";
				if(determiniert){
					try {
					   	eval(document.getElementById("determiniert").value);
					} catch (e) {
					    if (e instanceof SyntaxError) {
					        alert("Du hast ein Fehler in deinem Code! Hinweis: "+e.message);
					    }
					}
				}
				// End Grammatik-Checker

				document.getElementById("word").innerHTML=word_backup+output;
				return ausgabe;
			};

			this.erzeugeAusgabe = function(){
				var inhaltSchritte = this.erzeugeSchritte();
				var inhaltEingabe = this.erzeugeEingabe();
				document.getElementById("ausgabe").innerHTML=inhaltSchritte;
				document.getElementById("eingabe").innerHTML=inhaltEingabe;
			};
		}

		function starte(){
			produktionsregel = [];
			word ="S";
			wordlist="";
			eingabe="";
			ProduktionsregelGenerator_Instanz = new ProduktionsregelGenerator();
			ProduktionsregelGenerator_Instanz.encode();
			L_von_G_Instanz = new L_von_G();
			L_von_G_Instanz.erzeugeAusgabe();
		}

		// DOCUMENT READY
		(function() {
			starte();
		})();	