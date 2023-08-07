package com.kkini.core.domain.recipe.service;

import com.kkini.core.domain.recipe.dto.request.SearchConditionRequestDto;
import com.kkini.core.domain.recipe.dto.response.RecipeDetailResponseDto;
import com.kkini.core.domain.recipe.dto.response.RecipeListResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RecipeQueryService {
    RecipeDetailResponseDto getRecipeDetail(Long recipeId);

    Page<RecipeListResponseDto> getRecipeList(SearchConditionRequestDto searchConditionRequestDto, Pageable pageable);
}
