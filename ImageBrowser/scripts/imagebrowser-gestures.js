var _imageGestures = [
	// next left, next right
	{ name: "line", ptArray: new Array(new Point(100,200), new Point(200,200)) },
	// undo
	{ name: "U", ptArray: new Array(new Point(130,205), new Point(130,245), new Point(131,249), new Point(131,253), new Point(132,256), new Point(133,258), new Point(134,260), new Point(135,261), new Point(135,263), new Point(136,265), new Point(138,266), new Point(139,268), new Point(141,270), new Point(142,271), new Point(144,273), new Point(146,274), new Point(147,276), new Point(149,277), new Point(151,277), new Point(153,279), new Point(155,279), new Point(157,280), new Point(159,280), new Point(161,281), new Point(171,281), new Point(174,280), new Point(176,280), new Point(178,278), new Point(181,277), new Point(183,276), new Point(185,274), new Point(187,273), new Point(189,270), new Point(191,268), new Point(193,265), new Point(195,262), new Point(196,259), new Point(197,256), new Point(198,251), new Point(199,250), new Point(200,246), new Point(201,240), new Point(201,205)) }, 
	// rotate
	{ name: "rotate", ptArray: new Array(new Point(277,147), new Point(276,147), new Point(275,147), new Point(274,147), new Point(272,147), new Point(272,149), new Point(271,150), new Point(268,153), new Point(267,156), new Point(266,158), new Point(265,162), new Point(265,164), new Point(265,166), new Point(265,168), new Point(265,171), new Point(264,174), new Point(263,178), new Point(263,181), new Point(263,185), new Point(263,188), new Point(263,190), new Point(265,193), new Point(268,195), new Point(271,198), new Point(276,200), new Point(280,202), new Point(285,202), new Point(289,203), new Point(295,204), new Point(301,204), new Point(322,201), new Point(325,200), new Point(329,197), new Point(332,196), new Point(334,194), new Point(337,191), new Point(338,187), new Point(340,185), new Point(342,179), new Point(343,176), new Point(343,168), new Point(343,164), new Point(343,158), new Point(343,149), new Point(343,141), new Point(342,132), new Point(339,126), new Point(336,119), new Point(331,112), new Point(326,106), new Point(317,99), new Point(309,94), new Point(296,88), new Point(292,86), new Point(286,85), new Point(281,84), new Point(276,84), new Point(265,85), new Point(253,90), new Point(248,93), new Point(241,97), new Point(232,100), new Point(226,104), new Point(221,108), new Point(218,111), new Point(215,117), new Point(212,125), new Point(209,134), new Point(205,143), new Point(202,149), new Point(201,154), new Point(199,156), new Point(199,158)) },
	// posterize
	{ name: "P", ptArray: new Array(new Point(228,260), new Point(228,257), new Point(228,253), new Point(228,249), new Point(228,242), new Point(227,235), new Point(227,227), new Point(227,209), new Point(227,190), new Point(227,175), new Point(227,160), new Point(227,150), new Point(227,140), new Point(227,135), new Point(227,132), new Point(227,130), new Point(230,130), new Point(232,130), new Point(236,130), new Point(240,130), new Point(243,130), new Point(247,130), new Point(256,130), new Point(264,130), new Point(271,130), new Point(282,131), new Point(288,134), new Point(292,138), new Point(296,141), new Point(300,144), new Point(303,148), new Point(306,152), new Point(308,156), new Point(310,160), new Point(310,163), new Point(310,166), new Point(310,170), new Point(310,172), new Point(307,178), new Point(302,183), new Point(297,187), new Point(290,192), new Point(278,198), new Point(272,200), new Point(266,200), new Point(260,200), new Point(253,200), new Point(247,200), new Point(241,201), new Point(237,201), new Point(235,201), new Point(234,201)) },
	// sepia
	{ name: "S", ptArray: new Array(new Point(238,86), new Point(237,86), new Point(236,85), new Point(235,84), new Point(234,84), new Point(232,83), new Point(229,83), new Point(227,82), new Point(225,81), new Point(222,80), new Point(219,80), new Point(215,79), new Point(213,78), new Point(210,78), new Point(208,78), new Point(207,78), new Point(205,78), new Point(204,78), new Point(203,78), new Point(202,78), new Point(201,79), new Point(200,80), new Point(199,80), new Point(199,82), new Point(198,83), new Point(197,85), new Point(196,86), new Point(196,87), new Point(196,88), new Point(196,89), new Point(196,90), new Point(196,91), new Point(196,93), new Point(196,94), new Point(196,95), new Point(196,97), new Point(196,98), new Point(196,99), new Point(196,100), new Point(196,102), new Point(196,103), new Point(196,104), new Point(196,105), new Point(197,106), new Point(197,107), new Point(198,107), new Point(198,108), new Point(199,109), new Point(200,109), new Point(201,110), new Point(202,110), new Point(203,110), new Point(204,110), new Point(205,111), new Point(206,112), new Point(207,112), new Point(208,112), new Point(210,113), new Point(212,113), new Point(214,113), new Point(215,114), new Point(217,114), new Point(218,115), new Point(219,116), new Point(220,116), new Point(222,116), new Point(223,116), new Point(225,117), new Point(226,117), new Point(227,117), new Point(227,118), new Point(228,119), new Point(229,119), new Point(230,120), new Point(231,120), new Point(232,121), new Point(233,122), new Point(234,123), new Point(235,124), new Point(235,126), new Point(236,128), new Point(236,130), new Point(237,132), new Point(237,134), new Point(237,137), new Point(237,139), new Point(237,141), new Point(237,142), new Point(237,144), new Point(237,145), new Point(236,146), new Point(236,147), new Point(235,148), new Point(233,150), new Point(231,150), new Point(230,150), new Point(228,151), new Point(226,151), new Point(224,151), new Point(222,151), new Point(221,151), new Point(219,151), new Point(217,151), new Point(216,151), new Point(214,151), new Point(212,151), new Point(210,151), new Point(209,151), new Point(208,151), new Point(207,151), new Point(206,151), new Point(204,151), new Point(203,151), new Point(202,150), new Point(201,150), new Point(200,149), new Point(199,149), new Point(198,148), new Point(197,148), new Point(196,148), new Point(192,145)) }
];

/*

	// crop
	{ name: "C", ptArray: new Array(new Point(183,109), new Point(177,108), new Point(173,107), new Point(166,107), new Point(160,110), new Point(156,113), new Point(153,116), new Point(149,121), new Point(147,126), new Point(144,131), new Point(142,137), new Point(141,143), new Point(141,150), new Point(141,158), new Point(142,162), new Point(144,166), new Point(147,170), new Point(151,174), new Point(156,179), new Point(161,182), new Point(168,185), new Point(174,187), new Point(181,187), new Point(185,185)) },
	
	// add
	{ name: "A", ptArray: new Array(new Point(316,227), new Point(316,226), new Point(316,225), new Point(316,224), new Point(316,223), new Point(316,221), new Point(317,219), new Point(317,215), new Point(318,214), new Point(319,210), new Point(320,207), new Point(321,204), new Point(322,201), new Point(323,199), new Point(324,194), new Point(325,190), new Point(327,186), new Point(329,182), new Point(331,178), new Point(332,174), new Point(335,170), new Point(335,168), new Point(337,165), new Point(337,164), new Point(338,163), new Point(339,161), new Point(339,160), new Point(340,157), new Point(342,154), new Point(344,149), new Point(346,145), new Point(348,142), new Point(349,139), new Point(350,137), new Point(350,136), new Point(350,135), new Point(351,135), new Point(351,134), new Point(351,133), new Point(352,133), new Point(352,132), new Point(352,131), new Point(353,131), new Point(353,129), new Point(355,128), new Point(356,125), new Point(357,122), new Point(357,121), new Point(357,120), new Point(358,120), new Point(359,120), new Point(359,122), new Point(359,123), new Point(360,124), new Point(360,125), new Point(361,127), new Point(362,129), new Point(363,134), new Point(365,138), new Point(366,145), new Point(367,153), new Point(369,159), new Point(369,164), new Point(371,168), new Point(373,174), new Point(374,178), new Point(376,183), new Point(378,187), new Point(379,190), new Point(380,194), new Point(381,196), new Point(382,199), new Point(382,201), new Point(383,204), new Point(383,205), new Point(383,207), new Point(384,210), new Point(384,211), new Point(385,213), new Point(385,215), new Point(385,217), new Point(386,220), new Point(386,221), new Point(386,223), new Point(387,225), new Point(388,226), new Point(388,227), new Point(388,228), new Point(389,229), new Point(389,230), new Point(388,229), new Point(387,228), new Point(387,227), new Point(386,225), new Point(385,224), new Point(382,222), new Point(381,221), new Point(377,218), new Point(372,215), new Point(369,212), new Point(364,208), new Point(360,205), new Point(356,201), new Point(352,197), new Point(349,194), new Point(346,191), new Point(345,190), new Point(344,188), new Point(343,187), new Point(342,186), new Point(342,185), new Point(342,184), new Point(341,184), new Point(341,183), new Point(341,182), new Point(341,181), new Point(340,181), new Point(340,180), new Point(339,179), new Point(338,179), new Point(338,178), new Point(337,177), new Point(336,176), new Point(335,176), new Point(334,175), new Point(334,174), new Point(336,174), new Point(338,174), new Point(341,174), new Point(344,174), new Point(346,174), new Point(349,174), new Point(355,174), new Point(361,174), new Point(364,174), new Point(368,174), new Point(369,174), new Point(371,174), new Point(372,174), new Point(373,174), new Point(374,174), new Point(375,174), new Point(376,174), new Point(377,174), new Point(378,174), new Point(379,174), new Point(380,174), new Point(380,173), new Point(381,173)) },
	
	// delete
	{ name: "D", ptArray: new Array(new Point(173,147), new Point(173,149), new Point(173,152), new Point(173,155), new Point(173,159), new Point(173,166), new Point(173,173), new Point(173,181), new Point(173,196), new Point(174,214), new Point(174,221), new Point(177,244), new Point(178,251), new Point(179,255), new Point(180,262), new Point(180,267), new Point(180,269), new Point(180,272), new Point(180,274), new Point(180,275), new Point(180,276), new Point(180,278), new Point(180,277), new Point(180,276), new Point(180,274), new Point(180,273), new Point(180,272), new Point(180,269), new Point(180,267), new Point(180,266), new Point(180,261), new Point(180,254), new Point(180,244), new Point(180,231), new Point(180,223), new Point(180,208), new Point(180,198), new Point(180,191), new Point(181,182), new Point(183,175), new Point(184,170), new Point(184,167), new Point(184,166), new Point(184,164), new Point(184,163), new Point(185,162), new Point(186,161), new Point(191,158), new Point(196,155), new Point(204,152), new Point(211,150), new Point(218,149), new Point(223,149), new Point(227,149), new Point(233,150), new Point(239,154), new Point(245,161), new Point(251,169), new Point(255,176), new Point(257,184), new Point(258,190), new Point(258,201), new Point(258,212), new Point(250,227), new Point(242,244), new Point(236,253), new Point(230,262), new Point(227,266), new Point(224,269), new Point(219,271), new Point(215,272), new Point(211,273), new Point(209,273), new Point(203,275), new Point(197,276), new Point(193,276), new Point(189,276), new Point(187,276), new Point(186,276), new Point(185,276), new Point(184,276), new Point(184,275), new Point(184,274), new Point(183,274)) },

	// next left,next right, delete
	{ name: "line-vert", ptArray: new Array(new Point(100,200), new Point(100,300)) },

	// rotate left, rotate right
	{ name: "rotate", ptArray: new Array(new Point(377,308), new Point(373,307), new Point(366,307), new Point(360,310), new Point(356,313), new Point(353,316), new Point(349,321), new Point(347,326), new Point(344,331), new Point(342,337), new Point(341,343), new Point(341,350), new Point(341,358), new Point(342,362), new Point(344,366), new Point(347,370), new Point(351,374), new Point(356,379), new Point(361,382), new Point(368,385), new Point(374,387), new Point(381,387), new Point(390,387), new Point(397,385), new Point(404,382), new Point(408,378), new Point(412,373), new Point(416,367), new Point(418,361), new Point(419,353), new Point(419,348)) },

	// redo
	{ name: "R", ptArray: new Array(new Point(107,197), new Point(113,107), new Point(128,107), new Point(137,108), new Point(144,110), new Point(150,112), new Point(155,115), new Point(158,118), new Point(160,122), new Point(161,127), new Point(162,133), new Point(161,137), new Point(159,142), new Point(156,145), new Point(150,148), new Point(144,151), new Point(138,153), new Point(132,154), new Point(125,155), new Point(119,155), new Point(113,155), new Point(158,197)) },

*/