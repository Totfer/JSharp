$(document).ready(function(){
	$('ul.tabsce li a:first').addClass('activece');
	$('.seccionesce article').hide();
	$('.seccionesce article:first').show();

	$('ul.tabsce li a').click(function(){
		$('ul.tabsce li a').removeClass('activece');
		$(this).addClass('activece');
		$('.seccionesce article').hide();

		var activeTab = $(this).attr('href');
		$(activeTab).show();
		return false;
	});
});