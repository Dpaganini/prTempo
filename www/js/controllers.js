angular.module('starter.controllers', ['ionic', 'ui.select'])


.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        }
        else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    }
})

.controller('index', function ($scope, $http, $state, $cordovaGeolocation) {

    // console.log("teste");
    // var posOptions = {
    //     timeout: 10000,
    //     enableHighAccuracy: false
    // };
    // var buscaLocal = function () {
    //     console.log("Rodando local OK");
    //     $cordovaGeolocation
    //         .getCurrentPosition(posOptions)
    //         .then(function (position) {
    //             console.log("Rodando local OK")
    //             var lat = position.coords.latitude
    //             var long = position.coords.longitude

    //             buscaCidadeJson(lat, long)
    //         }, function (err) {
    //             console.log("Erro no local")
    //                 // error
    //         });
    //     console.log("chamando")
    // }
    // var buscaCidadeJson = function (lat, long) {
    //     $http.get("http://nominatim.openstreetmap.org/reverse?lat=" + lat + "&lon=" + long + "&format=json").success(function (data) {
    //         //  http://nominatim.openstreetmap.org/reverse?lat=" + lat + "&lon=" + long + "&format=json&json_callback=my_callback"
    //         $scope.cidade = data.address.city
    //         $scope.baixaXml();
    //     });
    // };

    // buscaLocal();

})

.controller('PrevisaoCtrl', function ($scope, $http, $cordovaGeolocation, $sce, $rootScope) {

    // Definindo Cidade Padrão (Upgrade)

    $rootScope.cidadePrevi = {
        cidadeId: '4104808',
        text: "Cascavel (Atual-Emulado)"
    };

    // Buscando lista de cidades do Paraná

    $http.get("js/cidades.json").success(function (data) {
        $rootScope.listaCidades = data.data;
        // $scope.buscaIdCidade()
    });

    // Buscando lista de Principais cidades do Paraná

    $http.get("js/cidadesPrincipais.json").success(function (data) {
        $scope.listaCidadesPrincipais = data.data;
    });

    // GeoLocalização - Busca da Posição pelo $cordovaGeoLocation - Início
    // Configuração do Plugin

    var posOptions = {
        timeout: 10000,
        enableHighAccuracy: false
    };

    // Buscando localização por gps

    $scope.buscaLocal = function () {
        console.log("Buscando local");
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                var lat = position.coords.latitude
                var long = position.coords.longitude
                buscaCidadeJson(lat, long)
            }, function (err) {
                console.log("Erro no local")
                    // error
            });
    };

    // Buscando nome da cidade no WebService do OpenStreetMap

    var buscaCidadeJson = function (lat, long) {
        $http.get("http://nominatim.openstreetmap.org/reverse?lat=" + lat + "&lon=" + long + "&format=json").success(function (data) {
            //  http://nominatim.openstreetmap.org/reverse?lat=" + lat + "&lon=" + long + "&format=json&json_callback=my_callback"
            $scope.cidade = data.address.city
            $scope.buscaIdCidade();
        });
    };

    // Buscando o ID da cidade na lista de cidades do escopo/menu (Upgrade para buscar do json/xml)

    $scope.buscaIdCidade = function () {
        angular.forEach($rootScope.listaCidades, function (item) {
            if (item.text === $scope.cidade) {
                $rootScope.cidadePrevi = {
                    cidadeId: item.cidadeId,
                    text: item.text + " (Atual)"
                }
                $scope.baixaXml();
            }
        });

    }


    // Para UI saber se collapse da palavra do metereologista está ativo ou não - VERIFICAR

    $scope.palavraRes = false;

    $scope.palavra = function () {
        $scope.palavraRes = !$scope.palavraRes;
    };



    // Funções ao atualizar - Pull down configurado no <ion-refresher on-refresh="doRefresh()" spinner="lines"> do HTML

    $scope.doRefresh = function () {

        $scope.init();

        $scope.trocaImagemFundo();

        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');


    };

    // Funcionalidade de imagens de fundo

    // Lista de imagens

    var listaImagensFundo = ["alagado.jpg", "flor.jpg", "grama.jpg", "praia.jpg"];
    $scope.numImagemFundo = {}
        // Random imagem e troca do link

    $scope.trocaImagemFundo = function () {
        var num = Math.floor(Math.random() * listaImagensFundo.length);
        if ($scope.numImagemFundo == num) {
            $scope.trocaImagemFundo();
        }
        else {
            $scope.numImagemFundo = num;
            var img = listaImagensFundo[num];
            var imagemFundo = {
                'background-image': 'url(img/' + img + ')'
            };
            $scope.imagemFundo = imagemFundo;
        }
    }

    // Helper para o ng-style="retornaImgFundo()" do HTML

    $scope.retornaImgFundo = function () {
        var imagemFundo = $scope.imagemFundo;
        return imagemFundo;
    }

    // Funções de inicialização do controller

    $scope.init = function () {
        $scope.baixaXml();
        $scope.plataforma = ionic.Platform.platform();
        $scope.buscaLocal();
        $scope.trocaImagemFundo();
    };

    // Função de troca de cidade ao escolher no drop-down do HTML

    $rootScope.trocaCidade = function (id, nome) {
        $rootScope.cidadePrevi.cidadeId = id;
        $rootScope.cidadePrevi.text = nome;
        $scope.baixaXml();
    }



    // Função de baixar o XML da previsão e chamar o parser personalizado

    $scope.baixaXml = function () {

        $http.get("http://www.simepar.br/tempo2/xml/PR/" + $rootScope.cidadePrevi.cidadeId + ".xml").success(function (data) {
            // console.log(data);
            var x2js = new X2JS();
            var jsonData = x2js.xml_str2json(data);
            // console.log(jsonData);
            carregaXml(jsonData);
        });
    }

    // Capturar e selecionar dados do XML baixado

    var carregaXml = function (jsonData) {

        $scope.munNome = jsonData.boletim.municipio._nome;

        $scope.bol_Data = jsonData.boletim._data;
        $scope.bol_Periodo = jsonData.boletim._periodo;

        //------Palavra do Metereologista

        $scope.cond_Dia1Data = jsonData.boletim.condicoes.dia1._data;
        $scope.cond_Dia1Semana = jsonData.boletim.condicoes.dia1._diadasemana;
        $scope.cond_Dia1Dados = jsonData.boletim.condicoes.dia1.__cdata;
        $scope.cond_Dia1Dados = $scope.cond_Dia1Dados.replace(/<(?:.|\n)*?>/gm, '');



        $scope.cond_Dia2Data = jsonData.boletim.condicoes.dia2._data;
        $scope.cond_Dia2Semana = jsonData.boletim.condicoes.dia2._diadasemana;
        $scope.cond_Dia2Dados = jsonData.boletim.condicoes.dia2.__cdata;
        $scope.cond_Dia2Dados = $scope.cond_Dia2Dados.replace(/<(?:.|\n)*?>/gm, '');

        //------Fim da palavra

        //------Data e Maxima do dia    

        $scope.prev1_Data = jsonData.boletim.municipio.dia1._data.substring(0, 5);
        $scope.prev1_Semana = jsonData.boletim.municipio.dia1._diadasemana;

        if (jsonData.boletim.municipio.dia1.hasOwnProperty('temperatura')) {
            $scope.prev1_TempMax = jsonData.boletim.municipio.dia1.temperatura.max;
            $scope.prev1_TempMin = jsonData.boletim.municipio.dia1.temperatura.min;
            $scope.maxima = true;
        }
        else {
            $scope.maxima = false;
        }
        //------Fim Maxima do dia

        // ---- Inicio Periodos

        if (jsonData.boletim.municipio.dia1.tempo.hasOwnProperty('legendamadrugada')) {
            $scope.prev1_Madrugada = jsonData.boletim.municipio.dia1.tempo.legendamadrugada.__text;
            $scope.prev1_MadrugadaIcone = jsonData.boletim.municipio.dia1.tempo.legendamadrugada._icone;
            $scope.madrugada = true;
        }
        else {
            $scope.madrugada = false;
        }



        if (jsonData.boletim.municipio.dia1.tempo.hasOwnProperty('legendamanha')) {
            $scope.prev1_Manha = jsonData.boletim.municipio.dia1.tempo.legendamanha.__text;
            $scope.prev1_ManhaIcone = jsonData.boletim.municipio.dia1.tempo.legendamanha._icone;
            $scope.manha = true;
        }
        else {
            $scope.manha = false;

        }


        if (jsonData.boletim.municipio.dia1.tempo.hasOwnProperty('legendanoite')) {
            $scope.prev1_Noite = jsonData.boletim.municipio.dia1.tempo.legendanoite.__text;
            $scope.prev1_NoiteIcone = jsonData.boletim.municipio.dia1.tempo.legendanoite._icone;
            $scope.noite = true;
        }
        else {
            $scope.noite = false;
        }

        if (jsonData.boletim.municipio.dia1.tempo.hasOwnProperty('legendatarde')) {
            $scope.prev1_Tarde = jsonData.boletim.municipio.dia1.tempo.legendatarde.__text;
            $scope.prev1_TardeIcone = jsonData.boletim.municipio.dia1.tempo.legendatarde._icone;
            $scope.tarde = true;
        }
        else {
            $scope.tarde = false;
        }

        // ---- Fim Periodos

        if (jsonData.boletim.municipio.dia1.hasOwnProperty('vento')) {
            $scope.prev1_VentoDir = jsonData.boletim.municipio.dia1.vento.direcao;
            $scope.prev1_VentoInt = jsonData.boletim.municipio.dia1.vento.intensidade;
            $scope.vento = true;
        }
        else {
            $scope.vento = false;
        }


        if (jsonData.boletim.municipio.dia1.hasOwnProperty('visibilidade')) {
            $scope.prev1_Visibilidade = jsonData.boletim.municipio.dia1.visibilidade;
            $scope.visibilidade = true;
        }
        else {
            $scope.visibilidade = false;
        }


        //------Fim dia 1        

        //------Outros dias

        $scope.prev2_Data = jsonData.boletim.municipio.dia2._data.substring(0, 5);
        $scope.prev2_Semana = jsonData.boletim.municipio.dia2._diadasemana;
        $scope.prev2_TempMax = jsonData.boletim.municipio.dia2.temperatura.max;
        $scope.prev2_TempMin = jsonData.boletim.municipio.dia2.temperatura.min;

        if (jsonData.boletim.municipio.dia2.tempo.hasOwnProperty('legendadia')) {
            $scope.prev2_Dia = jsonData.boletim.municipio.dia2.tempo.legendadia.__text;
            $scope.prev2_DiaIcone = jsonData.boletim.municipio.dia2.tempo.legendadia._icone;
            $scope.prev2_legendadia2 = true;
            console.log("verdade");
        }

        else {
            $scope.prev2_legendadia2 = false;
            console.log("falso2");
            // ---- Inicio Periodos DIA 2


            if (jsonData.boletim.municipio.dia2.tempo.hasOwnProperty('legendamadrugada')) {
                $scope.prev2_Madrugada = jsonData.boletim.municipio.dia2.tempo.legendamadrugada.__text;
                $scope.prev2_MadrugadaIcone = jsonData.boletim.municipio.dia2.tempo.legendamadrugada._icone;
                $scope.madrugada2 = true;
                console.log("mad verd");
            }
            else {
                $scope.madrugada2 = false;
                console.log("mad fals ");
            }


            if (jsonData.boletim.municipio.dia2.tempo.hasOwnProperty('legendamanha')) {
                $scope.prev2_Manha = jsonData.boletim.municipio.dia2.tempo.legendamanha.__text;
                $scope.prev2_ManhaIcone = jsonData.boletim.municipio.dia2.tempo.legendamanha._icone;
                $scope.manha2 = true;
            }
            else {
                $scope.manha2 = false;
            }

            if (jsonData.boletim.municipio.dia2.tempo.hasOwnProperty('legendanoite')) {
                $scope.prev2_Noite = jsonData.boletim.municipio.dia2.tempo.legendanoite.__text;
                $scope.prev2_NoiteIcone = jsonData.boletim.municipio.dia2.tempo.legendanoite._icone;
                $scope.noite2 = true;
            }
            else {
                $scope.noite2 = false;
            }

            if (jsonData.boletim.municipio.dia2.tempo.hasOwnProperty('legendatarde')) {
                $scope.prev2_Tarde = jsonData.boletim.municipio.dia2.tempo.legendatarde.__text;
                $scope.prev2_TardeIcone = jsonData.boletim.municipio.dia2.tempo.legendatarde._icone;
                $scope.tarde2 = true;
            }
            else {
                $scope.tarde2 = false;
            }

        }

        // ---- Fim Periodos Dia 2

        $scope.prev2_VentoDir = jsonData.boletim.municipio.dia2.vento.direcao;
        $scope.prev2_VentoInt = jsonData.boletim.municipio.dia2.vento.intensidade;

        $scope.prev2_Visibilidade = jsonData.boletim.municipio.dia2.visibilidade;



        $scope.prev3_Data = jsonData.boletim.municipio.dia3._data.substring(0, 5);
        $scope.prev3_Semana = jsonData.boletim.municipio.dia3._diadasemana;
        $scope.prev3_TempMax = jsonData.boletim.municipio.dia3.temperatura.max;
        $scope.prev3_TempMin = jsonData.boletim.municipio.dia3.temperatura.min;

        $scope.prev3_Dia = jsonData.boletim.municipio.dia3.tempo.legendadia.__text;
        $scope.prev3_DiaIcone = jsonData.boletim.municipio.dia3.tempo.legendadia._icone;

        $scope.prev3_VentoDir = jsonData.boletim.municipio.dia3.vento.direcao;
        $scope.prev3_VentoInt = jsonData.boletim.municipio.dia3.vento.intensidade;

        $scope.prev3_Visibilidade = jsonData.boletim.municipio.dia3.visibilidade;



        $scope.prev4_Data = jsonData.boletim.municipio.dia4._data.substring(0, 5);
        $scope.prev4_Semana = jsonData.boletim.municipio.dia4._diadasemana;
        $scope.prev4_TempMax = jsonData.boletim.municipio.dia4.temperatura.max;
        $scope.prev4_TempMin = jsonData.boletim.municipio.dia4.temperatura.min;

        $scope.prev4_Dia = jsonData.boletim.municipio.dia4.tempo.legendadia.__text;
        $scope.prev4_DiaIcone = jsonData.boletim.municipio.dia4.tempo.legendadia._icone;

        $scope.prev4_VentoDir = jsonData.boletim.municipio.dia4.vento.direcao;
        $scope.prev4_VentoInt = jsonData.boletim.municipio.dia4.vento.intensidade;

        $scope.prev4_Visibilidade = jsonData.boletim.municipio.dia4.visibilidade;



        $scope.prev5_Data = jsonData.boletim.municipio.dia5._data.substring(0, 5);
        $scope.prev5_Semana = jsonData.boletim.municipio.dia5._diadasemana;
        $scope.prev5_TempMax = jsonData.boletim.municipio.dia5.temperatura.max;
        $scope.prev5_TempMin = jsonData.boletim.municipio.dia5.temperatura.min;

        $scope.prev5_Dia = jsonData.boletim.municipio.dia5.tempo.legendadia.__text;
        $scope.prev5_DiaIcone = jsonData.boletim.municipio.dia5.tempo.legendadia._icone;

        $scope.prev5_VentoDir = jsonData.boletim.municipio.dia5.vento.direcao;
        $scope.prev5_VentoInt = jsonData.boletim.municipio.dia5.vento.intensidade;

        $scope.prev5_Visibilidade = jsonData.boletim.municipio.dia5.visibilidade;


    }

    $scope.init()



})

.controller('AgoraCtrl', function ($scope, $state, $http, $rootScope) {

    $rootScope.cidadeEstacao = {
        cidadeId: '4104808',
        graficoId: '24535333',
        text: "Cascavel (Atual-E-Emulado)"
    };

    //     $scope.listaEstacao = [
    //         {
    //             text: "Cascavel",
    //             estacaoId: "http://www.simepar.br/site/imagens/graficos_condicoes/24535333.png"
    //                 // estacaoId: "24535333"
    //         },
    //         {
    //             text: "Curitiba",
    //             estacaoId: "http://www.simepar.br/site/imagens/graficos_condicoes/25264916.png"
    //         },
    //         {
    //             text: "Foz do Iguaçu",
    //             estacaoId: "http://www.simepar.br/site/imagens/graficos_condicoes/25245437.png"
    //         },
    //         {
    //             text: "Toledo",
    //             estacaoId: "http://www.simepar.br/site/imagens/graficos_condicoes/24475343.png"
    //         },
    //         {
    //             text: "Maringá",
    //             estacaoId: "http://www.simepar.br/site/imagens/graficos_condicoes/23275159.png"
    //         }
    //   ];

    $http.get("js/cidadesEstacoes.json").success(function (data) {
        $scope.listaEstacoes = data.data;
    });

    $rootScope.trocaEstacao = function (id, estId, nome) {
        $rootScope.cidadeEstacao.cidadeId = id;
        $rootScope.cidadeEstacao.graficoId = estId;
        $rootScope.cidadeEstacao.text = nome;
        $scope.trocaGraficos(estId);
        $scope.baixaDivs();
        
    }

    $scope.trocaGraficos = function (estacaoId) {
        $scope.data.estacaoId = "http://www.simepar.br/site/imagens/graficos_condicoes/" + estacaoId + ".png";
    }

    $scope.data = {
        estacaoId: 'http://www.simepar.br/site/imagens/graficos_condicoes/24535333.png'
            // estacaoId: "24535333"
    };



    $scope.doRefresh = function () {
        $scope.baixaDivs();
        
        $state.go($state.current, {}, {
            reload: true
        });
        $scope.trocaImagemFundoAgora();
        console.log($scope.imagemFundoAgora);
        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');

    };

    // Função de captura de dados do HTML externo

    $scope.baixaDivs = function () {
        // $http.get("http://www.simepar.br/mobile/").then(
        $http.get("http://www.simepar.br/mobile/fragmentos/condicoes_atuais/PR/" + $rootScope.cidadeEstacao.cidadeId + ".html").then(
            // success handler
            function (response) {
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config;

                var el = document.createElement('html');
                el.innerHTML = data;

                var tempAtualBruto = el.getElementsByClassName('tempChuva')[0].childNodes[2].data;
                var chuvaBruto = el.getElementsByClassName('tempChuva')[0].childNodes[6].data;
                var urBruto = el.getElementsByClassName('ur')[0].childNodes[0].data;
                var ventoBruto = el.getElementsByClassName('vento')[0].childNodes[0].data;

                $scope.tempAtual = tempAtualBruto.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                $scope.chuva = chuvaBruto.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                $scope.ur = urBruto.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                $scope.vento = ventoBruto.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

                //   console.log(el.getElementsByClassName( 'vento' ));
                //   console.log(el.getElementsByClassName( 'ur' ));
                //   console.log(el.getElementsByClassName( 'tempChuva' ));
                //   console.log("------------");
                //   console.log(el.getElementsByClassName( 'tempChuva' )[0]);
                //   console.log("------------");
                //   console.log(el.getElementsByClassName( 'tempChuva' )[0].childNodes[2].data);
                //   $scope.t = $sce.trustAsHtml(data);
                //   console.log($scope.t);


                //var mydiv = data.document.getElementsByClassName("condicaoAtual");
                // var alguma = $("#vento").load("http://www.simepar.br/mobile/");
                //console.log(mydiv);
            },
            // error handler
            function (response) {
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config;
                //console.log(response.data);
            });
    }
    $scope.baixaDivs();
    
        // Funcionalidade de imagens de fundo

    // Lista de imagens
    
    var listaImagensFundo = ["alagado.jpg", "flor.jpg", "grama.jpg", "praia.jpg"];
    $scope.numImagemFundoAgora = {};
    
    // Random imagem e troca do link
    
    $scope.trocaImagemFundoAgora = function () {
        var num = Math.floor(Math.random() * listaImagensFundo.length);
        if ($scope.numImagemFundoAgora == num) {
            $scope.trocaImagemFundoAgora();
        }
        else {
            $scope.numImagemFundo = num;
            var img = listaImagensFundo[num];
            var imagemFundoAgora = {
                'background-image': 'url(img/' + img + ')'
            };
            $scope.imagemFundoAgora = imagemFundoAgora;
        }
    }

    // Helper para o ng-style="retornaImgFundo()" do HTML

    $scope.retornaImgFundoAgora = function () {
        var imagemFundoAgora = $scope.imagemFundoAgora;
        return imagemFundoAgora;
    }


})

.controller('RadarCtrl', function ($scope, $state) {

    $scope.radarCascavel = true;

    $scope.mudaRadar = function () {
        $scope.radarCascavel = !$scope.radarCascavel;

    }


    $scope.doRefresh = function () {
        $state.go($state.current, {}, {
            reload: true
        });

        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');

    };
    $scope.randomImg = Math.random();

})

.controller('SateliteCtrl', function ($scope, $state) {

    $scope.sateliteGoes = true;

    $scope.mudaSatelite = function () {
        $scope.sateliteGoes = !$scope.sateliteGoes;

    }


    $scope.doRefresh = function () {

        $state.go($state.current, {}, {
            reload: true
        });

        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');

    };

});
