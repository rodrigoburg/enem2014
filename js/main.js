var table;


//funcões que vamos usar na inicializacao
//a primeira cria um método para capitalizar só as primeiras letras de uma string
String.prototype.capitalize = function() {
    var temp = this.split(" ");
    var saida = "";
    temp.forEach(function (d){
        saida += d.charAt(0).toUpperCase() + d.slice(1).toLowerCase() + " ";
    })
    return saida.trim();
}

$(document).ready(function() {
    $.ajax({
        url : "dados/escolas_enem.txt",
        dataType: "text",
        success : function (dados) {
            dados = $.csv.toArrays(dados);
            desenha_tabela(dados, function () {
                coloca_footer(function () {
                    cria_datable();
                });
            });
        }
    });
} );

function desenha_tabela(dados,callback) {
    var tabela = $("#tabela");
    tabela.append('<table id="tabela_real" class="tabela table table-hover table-condensed table-striped table-bordered">');

    var tableHeader = "<thead><tr>";
    var lista_inicial = dados.shift();
    lista_inicial.forEach(function (d) {
            tableHeader += "<th>" + d + "</th>";
    });
    tableHeader += "</tr></thead>";

    $("#tabela_real").append(tableHeader);

    var body = $("#tabela_real").append("<tbody>")

    dados.forEach( function(item) {
        var linha = "<tr>";
        item.forEach( function (d) {
            linha += "<td>"+d+"</td>"
        });
        linha += "</tr>";
        body.append(linha);
    });

    callback()
}

function cria_datable() {
    table = $('#tabela_real').DataTable({
        "lengthMenu": [[10,25, 50, 100, 150], [10, 25, 50, 100, 150]],
        "order": [[ 5, "desc" ]],

        "language": {
            "lengthMenu": "Mostrar _MENU_ linhas por página",
            "zeroRecords": "Não foi encontrado nenhum item",
            "info": "Mostrando página _PAGE_ de _PAGES_",
            "infoEmpty": "Não foi encontrado nenhum item",
            "infoFiltered": "(filtrado do total de _MAX_ itens)",
            "paginate": {
                "previous": "Anterior",
                "next": "Próxima",
                "first": "Primeira",
                "last": "Última"
            }
    }});
    table.columns().every( function () {
        var index = this[0][0]
        var that = this;
            $( 'input', this.footer() ).on( 'keyup change', function () {
                that
                    .search( this.value )
                    .draw();
            } );

            $( 'select', this.footer() ).on( 'change', function () {
                that
                    .search( this.value )
                    .draw();
            } );
    } );
    spinner.stop()

    $(".dataTables_filter").remove();

}

function coloca_footer(callback) {
    var $tfoot = $('<tfoot></tfoot>');
    $($('thead').clone(true, true).children().get().reverse()).each(function(){
        $tfoot.append($(this));
    });
    $tfoot.insertAfter('table thead');


    $('#tabela_real tfoot th').each( function () {
        var title = $('#tabela_real thead th').eq( $(this).index() ).text();
        if (title == "Nome da escola" || title == "Município") {
            $(this).html( '<input type="text" style="color:dimgray" placeholder="Buscar" />' );
        } else if (title == "UF") {
            var select = '<select name="estado"><option value=""><b>Todos</b></option><option value="ac">Acre</option><option value="al">Alagoas</option><option value="am">Amazonas</option><option value="ap">Amapá</option><option value="ba">Bahia</option><option value="ce">Ceará</option><option value="df">Distrito Federal</option><option value="es">Espírito Santo</option><option value="go">Goiás</option><option value="ma">Maranhão</option><option value="mt">Mato Grosso</option><option value="ms">Mato Grosso do Sul</option><option value="mg">Minas Gerais</option><option value="pa">Pará</option><option value="pb">Paraíba</option><option value="pr">Paraná</option><option value="pe">Pernambuco</option><option value="pi">Piauí</option><option value="rj">Rio de Janeiro</option><option value="rn">Rio Grande do Norte</option><option value="ro">Rondônia</option><option value="rs">Rio Grande do Sul</option><option value="rr">Roraima</option><option value="sc">Santa Catarina</option><option value="se">Sergipe</option><option value="sp">São Paulo</option><option value="to">Tocantins</option></select>'
            $(this).html(select);
        } else if (title == "Pública ou Privada") {
            var select = '<select name="publica"><option value="">Todos</option><option value="privada">Privada</option><option value="federal">Federal</option><option value="estadual">Estadual</option><option value="municipal">Municipal</option></select>'
            $(this).html(select);
        } else if (title == "Nível sócio-econômico") {
            var select = '<select name="nivel"><option value="">Todos</option><option value="Alto">Alto</option><option value="Baixo">Baixo</option><option value="Médio">Médio</option><option value="Médio Alto">Médio Alto</option><option value="Médio Baixo">Médio Baixo</option><option value="Muito Alto">Muito Alto</option><option value="Muito Baixo">Muito Baixo</option><option value="Sem informação">Sem informação</option></select>'
            $(this).html(select);
        } else {
            $(this).html("");
        }
    } );
    callback()
}